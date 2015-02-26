var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    async       = require('async'),
    _           = require('lodash');

module.exports = function (args) {
    var def = q.defer();

    async.waterfall([

        getQrCode.bind(null, args),
        verifyQrCodeHasUserAsOwner,
        updateQrCode

    ], function (err, res) {
        if(err) { return def.reject(err);}
        def.resolve(res);
    });

    return def.promise;
}

function getQrCode(args, next) {
    QrCode.model.findOne({_id : args.qrCodeId}).exec(function (err, res) {
        if (err) { return next(err); }
        args.qrCode = res;
        next(null, args);
    });
}

function verifyQrCodeHasUserAsOwner(args,next) {
    if ( args.qrCode.owner.toString() !== args.userId) { return next('User does not own QrCode'); }

    next(null, args);
}

function updateQrCode(args, next) {
    // _.extend(args.qrCode, args.body);

    var updater = args.qrCode.getUpdateHandler(args.req, args.res, {
        errorMessage: 'There was an error creating your new post:'
    });

    updater.process(args.req.body, {
        flashErrors: true,
        logErrors: true,
        fields: 'name, description, photo, selectedStatus'
    }, next);

    // args.qrCode.save(next);
}
