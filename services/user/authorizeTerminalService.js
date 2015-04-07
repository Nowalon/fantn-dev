var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    Terminal    = keystone.list('Terminal'),
    async       = require('async'),
    _           = require('lodash');
var crypto = require('crypto');

module.exports = function (args) {
    var def = q.defer();

    async.waterfall([

        updateTerminal.bind(null, args)

    ], function (err, res) {
        if(err) { return def.reject(err);}
        def.resolve(res);
    });

    return def.promise;
};


function getTerminal(args, next) {
    Terminal.model.findOne({terminalId : args.terminalId}).exec(function (err, resTerminal) {
        if (err) { return next(err); }
        if (!resTerminal) { return next({error: 'terminal not found'}); }
        args.Terminal = resTerminal;
        next(null, args);
    });
}


function updateTerminal(args, next) {
    args.terminal.requestedRole = args.reqData.requested_role;
    args.terminal.modifiedOn = Date.now();

    var updater = args.terminal.getUpdateHandler(args.req, args.res, {
        errorMessage: 'There was an error updating terminal:'
    });

    updater.process(args.req.body, {
        logErrors: true,
        fields: 'userId, terminalUserToken, modifiedOn, requestedRole'
    }, next);

    next(null, args);
}


/* */