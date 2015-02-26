/*
Execute a billing agreement after it has been created. See
billing_agreements/create.js to see a sample for creating an
agreement.

*/
"use strict";
var logger              = require('logfmt'),
    saveTransactionService  = require('../saveTransactionService'),
    async               = require('async'),
    appConstants        = require('../../../lib/shared/constants'),
    logger 		        = require('logfmt'),
    assign              = require('object-assign'),
    q                   = require('q');

module.exports = function (paypal, opts) {

    var def = q.defer();

    //Retrieve payment token appended as a parameter to the redirect_url specified in
    //billing plan was created. It could also be saved in the user session
    var paymentToken = opts.paymentToken;

    paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {

        if (error) {
            logger.log({
                type: 'error',
                msg: JSON.stringify(error),
                error: 'Paypal execute subscription'
            });
            def.reject(error);

        } else {

            saveAgreementAndUpdateUser({
                    agreement : billingAgreement,
                    user : opts.user
            }, function (err, res) {

                if (err) { def.reject(err); }
                else { def.resolve(res); }
            });
        }
    });

    return def.promise;
};

function saveAgreementAndUpdateUser(opts, next) {

    var obj = assign({}, opts, {
        amount : appConstants.subscriptions.MONTH.price,
        type : 'month',
        paymentService : 'Paypal',
        user : opts.user,
        paypal : opts.agreement
    });

    async.waterfall([

        saveAgreement.bind(null, obj),

        saveTransactionService

    ], function (err, res) {
        next(err, res);
    });
}

function saveAgreement (opts, next) {

    opts.user.agreement = opts.agreement;
    opts.user.subscriptionType = 'month';
    opts.user.markModified('agreement');
    opts.user.isActive = true;

    logger.log({type: 'info', what: 'SAVE PAYPAL AGREEMENT', email : opts.user.email, id : opts.user.id});

    opts.user.save(function(err,res) {
        next(err, opts);
    });
}
