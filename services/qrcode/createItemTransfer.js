var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    Terminal    = keystone.list('Terminal'),
    ItemTransfer    = keystone.list('ItemTransfer'),
    async       = require('async'),
    _           = require('lodash');


module.exports = function (args) {
    var def = q.defer();

    async.waterfall([

        getTerminal.bind(null, args),
        getQrCode,
        checkItemTransferExist,
        createItemTransfer

    ], function (err, res) {
        if(err) { return def.reject(err);}
        def.resolve(res);
    });

    return def.promise;
};


function getTerminal(args, next) {
    Terminal.model.findOne({terminalId : args.terminalId})
    .populate('userId')
    .exec(function (err, resTerminal) {
        if (err) { return next(err); }
        if (!resTerminal) { return next({error: 'terminal not found'}); }
        if (!resTerminal.userId) { return next({error: 'terminal user is not registered'}); }
        args.Terminal = resTerminal;
        args.User = resTerminal.userId;
        next(null, args);
    });
}


function getQrCode(args, next) {
    QrCode.model.findOne({serialNumber : args.itemId})
        .populate('owner')
        .exec(function (err, resQRcode) {
            if (err) { return next(err); }
            if (!resQRcode) { return next({error: 'QR-code not found'}); }
            args.QRcode = resQRcode;
            next(null, args);
    });
}


function checkItemTransferExist(args, next) {
        ItemTransfer.model.find({
            terminalId : args.Terminal,
            userId : args.User,
            qrCode : args.QRcode
        })
        .exec(function (err, item_Transfer) {
            if (err || !item_Transfer) {
                //logger.log({ type: 'error', msg: 'Failed to find ItemTransfer'});
                return next(err);
            }

            if (item_Transfer && item_Transfer.length) {
                return next({error: 'itemTransfer for that terminal, user and qr-code already exist'});
            } else {
                next(null, args);
            }
        });
}


function createItemTransfer(args, next) {
    var itemTransferData = {
        terminalId : args.Terminal,
        userId : args.User,
        qrCode : args.QRcode,
        location : {geo: args.geo_info},
        geoLoc_latitude: args.geo_info[1],
        geoLoc_longitude: args.geo_info[0]
    };

    var item_transfer = new ItemTransfer.model(itemTransferData);

        item_transfer.save(function (err) {
            if (err) {
                return next(err);
            }
            args.item_transfer = item_transfer;
            next(null, args);
        });
}


