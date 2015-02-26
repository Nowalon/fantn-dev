var keystone                    = require('keystone');
var handleIncomingSmsService    = require('../services/sms/handleIncomingSmsService');
var smsRetryService                = require('../services/sms/smsRetryService');

/**
* Get http:/ http://wwww.fantn.no/api/smsapi?gsm=GSM&operator=OPERATOR&kodeord=KODEORD&tekst=TEKST&kortnr=KORTNR
*/
module.exports.getPullMessage = function (req, res, next) {

    var app = keystone.get('sharedApp');

    var opts = {
        gsm         : req.query.gsm,
        operator    : req.query.operator,
        kodeord     : req.query.kodeord,
        tekst       : req.query.tekst,
        kortnr      : req.query.kortnr,
        land        : req.query.land
    };

    // TO TEBGU:
    // handleIncomingSmsService(opts, '1337')


    app.triggerHandleSMSJob(opts)
    .then(function (result) {
        res.send(result);
    }, function (err) {
        next(err);
    });
}

/** RETRIES */
/* When an item is lost a new retry object is created and the owner and his
* contacts should respond with an SMS with the format:
*
*          ====> Contact number (1,2 or 3)
*          |
*          ||==> counter for how many SMSRetry objects exists with contact 'x' being the current SMS sender
*          ||
* FANTN ACK11
*
*
* temporize will try to see if someone has sent an SMS for the given temporize object
*
* URL for temproize: https://yVFwwg2ORIii8046lFb5rQ:vq2b7s6j9ej9vftvrqreblt3@api.temporize.net/v1/events/when/{date}/{url}
*
*/

// /api/smsapi/retries/:id
module.exports.retry = function (req, res, next) {
    var smsRetryId = req.params.retryId;

    smsRetryService(smsRetryId)

    // app.triggerRetryService(opts)
    .then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
}
