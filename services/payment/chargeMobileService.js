var q               = require('q'),
    logger          = require('logfmt'),
    appConstants    = require('../../lib/shared/constants');
    sendSMSService  = require('../sms/sendSMSService');

module.exports = function (user, opts) {
    var def = q.defer();

    var messageId;

    logger.log({type:'info', msg: 'MOBILE SUBSCRIPTION MSG', subtype: opts.subscriptionType, gsm: user.mobile});

    if (!user.mobile) {
        def.reject({err: 'Mobile number is required'});
    }

    switch(opts.subscriptionType) {

        case appConstants.subscriptions.MONTH.label : messageId = 6; break;
        case appConstants.subscriptions.TWELVE.label : messageId = 8; break;
        case appConstants.subscriptions.TWENTYFOUR.label : messageId = 9; break;
        case appConstants.subscriptions.THIRTYSIX.label : messageId = 10; break;
        default: def.reject({error: 'Wrong Subscription Type: ' + opts.subscriptionType});
    }

    sendSMSService({
        messageId :messageId,
        number : user.mobile,
        land : opts.land
    })
    .then(def.resolve, def.reject);

    return def.promise;
}
