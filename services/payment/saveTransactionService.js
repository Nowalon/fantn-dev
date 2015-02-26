"use strict";

var createQrCodeService = require('../qrcode/createQrCode'),
    logger              = require('logfmt'),
    async               = require('async');

module.exports = function (opts, next) {

    async.waterfall([
        saveTransaction.bind(null, opts),
        createQrCodes
    ], function(err, res) {
        next(err, res);
    });
}

function saveTransaction (opts, next) {
    var transaction = {
        amount : opts.amount,
        subscriptionType : opts.type,
        createdAt : Date.now(),
        paymentService : opts.paymentService
    };

    // stripce result
    if (opts.customer) {
        transaction.customerId = opts.customer.id;
    }

    // paypal result
    if (opts.paypal) {
        transaction.paypal = opts.paypal;
    }

    opts.user.transactions.push(transaction);
    opts.user.subscriptionType = opts.type;
    opts.user.markModified('transactions');
    opts.user.isActive = true;

    logger.log({type:'info', what: 'SAVE TRANSACTION', email: opts.user.email, subscriptionType :  opts.type, amount : opts.amount});

    opts.user.save(function(err,res) {
        next(err, opts);
    });
}

function createQrCodes (opts, next) {
    createQrCodeService({amount:10, user : opts.user})
    .then(function (result) {
        next(null, result);

    }, function (err) {
        next(err);
    });
}
