var q                   = require('q'),
    async               = require('async'),
    logger              = require('logfmt'),
    sendSMSService      = require('./sendSMSService'),
    appConstants        = require('../../lib/shared/constants'),
    keystone            = require('keystone'),
    User                = keystone.list('User'),
    createQrCodeService = require('../qrcode/createQrCode');

module.exports = function (body, models) {
    var def = q.defer();

    var opts = {
        messageId : 7,
        number : body.gsm,
        amount : body.__amount,
        land : body.land,
        subType : body.__subType
    };

    async.waterfall([
        getUserByGsm.bind(null, opts),
        getResponseMessage,
        sendSMS,
        saveTransaction,
        createQrCodes

    ], function (err, msg) {
        if(err) {def.reject(err);}
        else {
            def.resolve('NORETURN');
        }
    });

    return def.promise;
};

function getUserByGsm (opts, next) {
    User.model.queryOne({where : {mobile : opts.number}})
    .then(function (res) {
        if(!res) {
            return next({error: 'Failed to find user with gsm ' + opts.number});
        }
        opts.__user = res;
        next(null, opts);
    }, next);
}

function sendSMS (opts, next) {

    sendSMSService(opts)
    .then(function (res) {
        next(null, opts);
    }, next);
}

function saveTransaction (opts, next) {

    var transaction = {
        amount : opts.amount,
        subscriptionType : opts.subType,
        createdAt : Date.now()
    };

    opts.__user.transactions.push(transaction);
    opts.__user.subscriptionType = transaction.type;
    opts.__user.markModified('transactions');
    opts.__user.isActive = true;

    logger.log({type:'info', what: 'TRANSACTION', trans : JSON.stringify(transaction), user: opts.__user.email});

    opts.__user.save(function(err,res) {
        next(err, opts);
    });
}

function createQrCodes (opts, next) {
    createQrCodeService({amount:10, user : opts.__user})
    .then(function (result) {
        next(null, opts);

    }, function (err) {
        next(err);
    });
}

function getResponseMessage (opts, next) {
    var msg = 'Takk og velkommen som medlem hos Fantn! Du vil motta Fantn merkene i posten om få dager. Logg deg inn på nettsiden for å se din status. Fantn vil trekke deg kr ';

    if (opts.subType === appConstants.subscriptions.MONTH.label) {

        msg += '17,- i innmeldingsavgift for denne tjenesten.';

    } else {

        if (opts.subType === appConstants.subscriptions.TWELVE.label) {

            msg += '130';

        } else if(opts.subType === appConstants.subscriptions.TWENTYFOUR.label ) {
            msg += '230';

        } else if(opts.subType === appConstants.subscriptions.THIRTYSIX.label ) {
            msg += '300';

        }else { return next({error: 'Wrong subType: ' + opts.subType}); }

        msg += ',- for denne tjenesten.';
    }
    
    opts.msg = msg;

    next(null, opts);
}
