var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    Terminal    = keystone.list('Terminal'),
    async       = require('async'),
    _           = require('lodash');

function createUniqueTerminal (terminalId, callback, promise, termRes) {

    var asyncOps = [];

        var newTerminal = new Terminal.model({
            terminalId : terminalId
//            userId : user
        });
        
        asyncOps.push(function (next) {
            newTerminal.save(function (err) {
                if (err) {
                    return next(err);
                }
                next();
            });
        });
        
        asyncOps.push(callback);

    async.series(asyncOps, function (err) {
        if (err) { promise.reject(err); }

        else {
            promise.resolve();
        }
    });
}

module.exports = function (opts, cb) {
    var terminalId      = opts.terminalId,
        callback        = cb || null,
        def             = q.defer();

    Terminal.model.find()
    .sort('-serialNumber')
    .limit(1)
    .exec()
    .then(createUniqueTerminal.bind(null, terminalId, callback, def));

    return def.promise;
};
