var _           = require('lodash'),
    async       = require('async'),
    keystone    = require('keystone'),
    logger      = require('logfmt'),
    QrCode      = keystone.list('QrCode'),
    q           = require('q');

var keystone;

function createUniqueQrCodes (amount, user, promise, qrRes) {
    var serialNumberBase = 1000000;

    // if there is already at least 1 QrCode created, append the serial number
    if ( qrRes && qrRes.length > 0) {
        serialNumberBase = parseInt(qrRes[0].serialNumber, 10) + 1;
    }

    logger.log({type: 'info', what: 'CREATE-QRCODES', user : user.email});

    // create #count many QrCodes (sync ops)
    var asyncOps = [];
    _.forEach(_.range(amount), function () {

        var qrCode = new QrCode.model({
            serialNumber : (++serialNumberBase),
            owner : user
        });

        asyncOps.push(function (next) {
            qrCode.save(function (err) {
                if (err) {
                    return next(err);
                }
                next();
            });
        });
    });

    async.series(asyncOps, function (err) {
        if (err) { promise.reject(err); }

        // send email to Fantn: print qrcodes
        else {
            promise.resolve();
        }
    });
}

module.exports = function (opts) {

    var amount          = opts.amount || 1,
        def             = q.defer(),
        user            = opts.user;

    QrCode.model.find()
    .sort('-serialNumber')
    .limit(1)
    .exec()
    .then(createUniqueQrCodes.bind(null,amount, user, def));

    return def.promise;
}
