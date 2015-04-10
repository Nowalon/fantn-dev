var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    Terminal    = keystone.list('Terminal'),
    Message     = keystone.list('Message'),
    msgIds      = require('../sms/smsConstants').msgIds,
    async       = require('async'),
    _           = require('lodash');
var crypto = require('crypto');
var request = require('request');
var getItemOwnerTerminalService = require('./getItemOwnerTerminalService');
var itemFoundSmsService = require('../sms/itemFoundSmsService');

function error404(err, res) {
    return res.status(404).json({error: err});
}

module.exports = function (args) {
    var def = q.defer();

    async.waterfall([

        getQrCodeItem.bind(null, args),
        getMessageById,
        translateMessage,
        updateQrCodeIssueSendOwnerSMS,

    ], function (err, res) {
        if(err) { return def.reject(err);}
        def.resolve(res);
    });

    return def.promise;
};




function getQrCodeItem(args, next) {
    QrCode.model.findOne({serialNumber : args.serialNumber})
        .populate('owner')
        .exec(function (err, resQRcode) {
            if (err) { return next(err); }
            if (!resQRcode) { return next({error: 'QR-code not found'}); }
            args.QRcode = resQRcode;
            args.tekst = resQRcode.serialNumber;
            args.findersGSM = '';
            args.findersLand = '';
            args.findersOperator = '';
            args.land = resQRcode.owner.mobileLand;
            next(null, args);
    });
}



function updateQrCodeIssueSendOwnerSMS(args, next) {

    itemFoundSmsService(args, args.QRcode)
        .then (function (result) {
            args.result = result || args.eventResult;
            next(null, args);
        })
        .fail(function(err){
            error(err, args.res);
        });
}


function getMessageById (opts, next) {
    var id = opts.messageId;

    // TODO: improve these
    if ( id <= 5 || id === msgIds.RETRY_NORMAL || id === msgIds.RETRY_FANTN) {

        // Translate the message
        Message.model.findOne({messageId : id}).exec(function (err, message) {
            if(err || !message) { error('wrong message id', opts.res); }
            opts.message = message;
            next(null, opts);
        });

    } /*else {

        if (id === 6) {
            def.resolve('Abonnement. Velkommen til Fantn! Pris kr 12 per måned, autofornyes. Kroner 17,- i innmeldingsavgift. For å avslutte: send STOPP til 004790222333. Support tlf 98628425 (8-16). Bekreft bestillingen ved å svare "FANTN start" på denne meldingen.');

        } else if (id === 7 ) {
            def.resolve('Takk og velkommen som medlem hos Fantn! Du vil motta Fantn merkene i posten om få dager. Logg deg inn på nettsiden for å se din status. Mvh Fantn.');

        } else if (id === 8 ) {
            def.resolve('Takk for din henvendelse. Du ønsker et Fantn 12-måneders medlemskap. Det koster kr 130,-. Svar "FANTN12" på denne meldingen for å starte ditt medlemskap.');

        } else if (id === 9 ) {
            def.resolve('Takk for din henvendelse. Du ønsker et Fantn 24-måneders medlemskap. Det koster kr 230,-. Svar "FANTN24" på denne meldingen for å starte ditt medlemskap.');

        } else if (id === 10 ) {
            def.resolve('Takk for din henvendelse. Du ønsker et Fantn 36-måneders medlemskap. Det koster kr 300,- Svar "FANTN36" på denne meldingen for å starte ditt medlemskap.');

        }else {
            def.reject('wrong message id');
        }
    }*/

//    return def.promise;
    else {
        opts.message = null;
        next(null, opts);
    }


};



//function translateMessage(message, messageId, opts) {
function translateMessage(opts, next) {
    var message = opts.message;
    var messageId = opts.messageId;

    var land = opts.land + '';
    var translatedMsg = '';

    if (_.contains(['47'], land)) {
        translatedMsg = message.nor;

    } else if (_.contains(['41', '43', '423', '49'], land)) {
        translatedMsg = message.gr;

    } else if(_.contains(['39', '378'], land )) {
        translatedMsg = message.it;

    } else if(_.contains(['46'], land )) {

        // sweden gets norwegian
        translatedMsg = message.nor;

    } else if(_.contains(['45'], land )) {

        translatedMsg = message.dk;

    } else if(_.contains(['33','221', '221','222','223','224','225','226',
        '227','228','229','230','235','237', '241','242', '243','252','253',
        '257','261','262','269','352','377','508','509','590', '594','596','678','681','687','689' ], land )) {

        translatedMsg = message.fr;

    } else if(_.contains(['34', '51', '52', '53', '54', '56','58', '376', '502', '503', '504', '505', '506','507', '591', '593', '595', '598'], land )) {

        translatedMsg = message.es;

    } else if(_.contains(['238', '239', '240', '244','245', '258', '351', '55', '56'], land )) {

        translatedMsg = message.pt;

    } else {
        translatedMsg = message.en;
    }

/*
    // send someone has found X message
    if ( messageId === 1 ) {
        translatedMsg = translatedMsg.replace('########', opts.QRcode.name);
        translatedMsg = translatedMsg.replace('%%%%%%%%', opts.smsRetryUnit.createACKMessage());

    // send retry sms
    } else if (messageId === msgIds.RETRY_NORMAL) {
        translatedMsg = translatedMsg.replace('########', opts.smsRetry.ownerName);
        translatedMsg = translatedMsg.replace('%%%%%%%%', opts.smsRetryUnit.createACKMessage());

    } else if (messageId === msgIds.RETRY_FANTN) {
        translatedMsg = translatedMsg.replace('########', opts.smsRetry.qrCode.serialNumber);

    // send find-contact info
    } else if (messageId === 3) {
        translatedMsg = translatedMsg.replace('########', opts.finderGsm);
    }
*/

//    def.resolve(translatedMsg);
        opts.translatedMsg = translatedMsg;
        next(null, opts);
}


/* */