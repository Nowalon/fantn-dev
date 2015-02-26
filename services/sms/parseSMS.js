var keystone = require('keystone');
var q = require('q');
var QrCode = keystone.list('QrCode');
var logger = require('logfmt');
var SMSRetry = keystone.list('SMSRetry');
var SMSRetryUnit = keystone.list('SMSRetryUnit');


function cmp (val, to) {
    return val.toLowerCase() === to.toLowerCase();
}

function isUserConfirmMsg(kodeord, tekst) {

    // tekst wasnt a serial number - "user confirmed" SMS
    return kodeord.toLowerCase() === 'fantn' && tekst.toLowerCase().match(/^a/);
}

function getSMSRetryObject (def, body) {
    var _id = body.tekst.replace(/^a/i, '');

    SMSRetryUnit.model.findOne({
        gsm : body.gsm,
        counter : _id
    })
    .populate('smsRetry')

    .exec()
    .then(function (res) {

        var ret = {
            smsRetry : res.smsRetry.toJSON(),
            smsType : 'User confirmation'
        };

        if(!res) {
            logger.log({ type: 'error', msg: 'USER CONFIRM BUT SMSRETRYUNIT NOT FOUND', _id : _id});

        }

        QrCode.model.find({_id : res.smsRetry.qrCode})
        .populate('owner')
        .exec(function (err, qrCode) {
            if (err || !qrCode) {
                logger.log({ type: 'error', msg: 'Failed to find qrCode for smsRetryUnit'});
            }

            ret.smsRetry.qrCode = qrCode;

            def.resolve(ret);
        });

    }, def.reject);
}

function parseSMS (body) {
    var def = q.defer();

    /* PAYMENT REQUESTS */

    // User wants to start a subscription
    // GET /api/smsapi?gsm=98628425&operator=47-telenor&kodeord=FANTN&tekst=start&kortnr=2030
    if ( cmp(body.kodeord, 'FANTN') && cmp(body.tekst, 'start') ) { def.reject('mobile:month'); }

    // User wants to pay one-time pay with mobile
    // GET /api/smsapi?gsm=98628425&operator=47-telenor&kodeord=FANTN12&tekst=&kortnr=2030
    else if ( cmp(body.kodeord, 'FANTN12') ) { def.reject('mobile:one'); }

    else if ( cmp(body.kodeord,'FANTN24')) { def.reject('mobile:two'); }

    else if ( cmp(body.kodeord,'FANTN36') ) { def.reject('mobile:three'); }


    /* QRCODE REQUESTS */
    else if (isUserConfirmMsg(body.kodeord, body.tekst)) {
        getSMSRetryObject(def, body);
    }

    else {

        // old way to do it
        // var serialNumber = body.tekst.split(' ')[0].trim().substring(0, 7);
        var serialNumber = body.tekst.split(' ')[0].trim();

        if (!serialNumber) {

            // tekst wasnt a serial number - "user confirmed" SMS
            def.reject('wrong message format');

        } else {

            QrCode.model.findOne().populate('owner')
            .where({serialNumber : serialNumber})
            .populate('owner')
            .exec()
            .then(def.resolve, def.reject);
        }

    }


    return def.promise;
};

module.exports = parseSMS;
