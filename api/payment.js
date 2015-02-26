var stripe                  = require('stripe')('sk_test_aBkTzPZE0vwMiZLXSKpLoUNJ'), // test key
    async                   = require('async'),
    chargeMobileService     = require('../services/payment/chargeMobileService'),
    saveTransactionService  = require('../services/payment/saveTransactionService'),
    utils                   = require('../lib/routeUtils'),
    logger 		            = require('logfmt'),
    createQrCodeService     = require('../services/qrcode/createQrCode'),
    payPalService           = require('../services/payment/paypalService'),
    appConstants            = require('../lib/shared/constants');


// Mobile payment
module.exports.chargeMobile = function (req, res, next) {
    var user = req.user;
    var subscriptionType = user.subscriptionType;

    if (!subscriptionType || (typeof subscriptionType !== 'string')) {next({error : 'Wrong subscription type: ' + subscriptionType})}

    chargeMobileService(user, {subscriptionType : subscriptionType})
    .then(function(result) {
        req.flash('success', 'Velkommen til FantN!');
        res.send(result);
    }, function (err) {
        req.flash('error', 'Payment failed: ' + err);
        res.redirect('/');
    });
};


module.exports.chargePaypal = function (req, res, next) {
    payPalService.sendToPaypal(req.user, req.body.subscriptionType)
    .then(function(opts) {

        req.session.paymentId = opts.paymentId;
        req.session.amount = opts.amount;
        req.session.type = opts.type;

        if (opts.paymentToken) {
            req.session.paymentToken = opts.paymentToken;
        }


        res.send({next : opts.redirectUrl});
    }, function (err){
        next(err);
    });
}


module.exports.executePaypal = function (req, res, next) {

    payPalService.execute({
        amount : req.session.amount,
        param : req.param,
        type : req.session.type,
        paymentId : req.session.paymentId,
        payerId : req.param('PayerID'),
        user : req.user
    })

    .then(function(result) {
        req.flash('success', 'Velkommen til FantN!');
        res.redirect('/me');
    }, function (err) {
        logger.log({err: err});
        next(err);
    });
}


module.exports.cancelPaypal = function (req, res) {
    req.flash('error', 'Payment Cancelled');
    res.redirect('/');
}


module.exports.executePaypalSubscription = function (req, res, next) {
    payPalService.executeSubscription({
        user : req.user,
        paymentToken: req.session.paymentToken
    })
    .then(function (result) {
        req.flash('success', 'Velkommen til FantN!');
        res.redirect('/me');
    }, next)
}


module.exports.cancelPaypalSubscription = function (req,res) {
    req.flash('error', 'Payment Cancelled');
    res.redirect('/');
}


// Stripe Card payment
// TODO: move this into its own service
module.exports.chargeStripe = function (req, res, next) {
    var user = req.user;
    var stripeToken = req.body.stripeToken;
    if (!stripeToken) { return next({error : 'Stripe token was not included'}); }

    var amount = appConstants.getSubscriptionPriceByLabel(user.subscriptionType);

    var chargeFn = user.subscriptionType === appConstants.subscriptions.MONTH.label ?
            subscription : oneTimePay;

    async.waterfall([

        chargeFn.bind(null, user.subscriptionType, stripeToken, req.user, amount),

    ], function (err, opts) {

        if (err) { return next(err); }

        saveTransactionService({
            amount : opts.amount,
            type : opts.type,
            paymentService : 'Stripe',
            customer : opts.customer,
            user : req.user

        }, function (err, result) {
            if (err) { next(err); }
            else { res.send(result); }
        });

    });
};

function subscription (type, stripeToken, user, amount, next) {
    var description = 'Customer for ' + user.email;

    stripe.customers.create({
        description: description,
        card: stripeToken,
        email : user.email,

        // 17 NOK first time
        account_balance : amount,
        plan: 'basic'
    }, function (err, customer) {
        next(err, {
            user : user,
            type: type,
            amount : amount,
            customer : customer
        });
    });
}

function oneTimePay(type, stripeToken, user, amount, next) {

    stripe.charges.create({
        card: stripeToken,
        currency: 'nok',
        amount: amount

    }, function (err) {
        next(err,{
            user : user,
            type: type,
            amount:amount
        });
    });
}
