var q       = require('q'),
    request = require('request'),
    _       = require('lodash'),
    qs      = require('querystring'),
    keystone= require('keystone'),
    logger  = require('logfmt'),
    Message = keystone.list('Message'),
    msgIds = require('./smsConstants').msgIds,
    iconv   = require('iconv-lite');


// URLEX: https://cpa.eurobate.com/push.php?bruker=Supperaadet&passord=suppe234raad&til={0}&avsender=004790222333&melding={1}", gsm, "Takk! Du vil bli kontaktet snart! Mvh FantN‏"
module.exports = function (opts) {
    var def = q.defer();

    opts.responseMatch = opts.responseMatch || 'Meldingen er sendt';

    var promise;
    if (!opts.msg) {
        promise = getMessageById(opts.messageId, opts);
    } else {
        promise = q.resolve(opts.msg);
    }

    promise
    .then(function (message) {

        iconv.extendNodeEncodings();
        var buf = new Buffer('melding=' + message, 'binary');

        var url = 'http://cpa.eurobate.com/push.php?' +
            qs.stringify({
                bruker: 'Supperaadet',
                passord : 'suppe234raad',
                til : opts.number,
                avsender : '004790222333',
                land : opts.land
            });

        logger.log({type: 'info', what: 'SMS-OUT', buff: message.toString(), url: url.toString() });

        var options = {
            url : url,
            method: 'post',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
            },
            body : buf
        };

        if (process.env.NODE_ENV === 'test') {
            def.resolve(true);
        } else {
            request.post(options, function (e, r, body) {
                if(e) {  def.resolve(false); }
                if(body.match(opts.responseMatch)) {
                    def.resolve(true);
                } else {
                    def.resolve(false);
                }
            });
        }
    })
    .fail(def.reject).done();

    return def.promise;
}


function getMessageById (id, opts) {
    var def = q.defer();

    // TODO: improve these
    if ( id <= 5 || id === msgIds.RETRY_NORMAL || id === msgIds.RETRY_FANTN) {

        // Translate the message
        Message.model.findOne({messageId : id}).exec(function (err, message) {
            if(err || !message) { def.reject('wrong message id'); }
            return translateMessage(def, message, id, opts);
        });


    } else {

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
    }


    return def.promise;
};

function translateMessage(def, message, messageId, opts) {
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


    // send someone has found X message
    if ( messageId === 1 ) {
        translatedMsg = translatedMsg.replace('########', opts.qrName);
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

    def.resolve(translatedMsg);

}
