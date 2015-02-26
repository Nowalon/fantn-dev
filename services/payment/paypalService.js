"use strict";
var paypal                  = require('paypal-rest-sdk'),
    saveTransactionService  = require('./saveTransactionService'),
    executeSubscription     = require('./paypal/executeSubscription'),
    createPlan              = require('./paypal/createPlan'),
    q                       = require('q'),
    logger 		            = require('logfmt'),
    appConstants            = require('../../lib/shared/constants'),
    utils                   = require('../../lib/routeUtils');

var config;

module.exports.init = function(opts) {
    config = opts;
    paypal.configure(opts);
};


module.exports.sendToPaypal = function (user, subscriptionType) {
    var def = q.defer();

    var price;
    var descEnding = appConstants.getPrintableLabel(subscriptionType);



    if ( subscriptionType === appConstants.subscriptions.MONTH.label) {

        logger.log({type: 'info', what: 'EXECUTE RECUTTING PAYPAL', email : user.email, id : user.id});

        // TODO: change this to a promise
        return executeRecurring();
    } else {
        price = appConstants.getSubscriptionPriceByLabel(subscriptionType);
        price = (price / 100) + '.00';
    }


    var payment = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'redirect_urls': {
            'return_url': utils.getUrl() + 'api/payment/paypal/execute',
            'cancel_url': utils.getUrl() + 'api/payment/paypal/cancel'
        },
        'transactions': [{
            'amount': {
                'total': price,
                'currency': 'NOK'
            },
            'description': 'FANTN subscription - ' + descEnding
        }]
    };

    paypal.payment.create(payment, function (error, payment) {

        if (error) {

            return def.reject(error);

        } else {
            logger.log({type: 'info', what: 'SEND USER TO PAYPAL', email : user.email, id : user.id, price : price});

            var opts = {};
            if ( payment.payer.payment_method === 'paypal' ) {

                opts.paymentId = payment.id;
                opts.amount = price;
                opts.type = subscriptionType;

                for(var i=0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        opts.redirectUrl = link.href;
                    }
                }

                def.resolve(opts);
            } else {
                def.reject({error: 'Failed to send user to Paypal'});
            }
        }
    });

    return def.promise;
};


/*
* /api/payment/paypal/execute
*/
module.exports.execute = function(opts) {
    var def = q.defer();

    var paymentId = opts.paymentId;
    var payerId = opts.payerId;
    var details = { 'payer_id': payerId };

    paypal.payment.execute(paymentId, details, function (error, payment) {

        if (error) {

            logger.log({
                type: 'error',
                msg: 'Paypal error',
                error: JSON.stringify(error)
            });
            return def.reject(error);

        } else {

            saveTransactionService({
                amount : opts.amount,
                type : opts.type,
                paymentService : 'Paypal',
                user : opts.user,
                paypal : payment

            }, function (err, result) {
                if (err) {
                    def.reject(err);
                }
                else { def.resolve(result); }
            });
        }
    });

    return def.promise;
};


module.exports.executeSubscription = function (opts) {
    return executeSubscription(paypal, opts);
};


// USER CHOSE RECURRING PAYMENT
function executeRecurring() {

    return createPlan(paypal);
};
