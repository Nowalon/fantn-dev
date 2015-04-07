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

        getTerminal.bind(null, args),
        generateToken,
        updateTerminal

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


function generateToken (opts, next) {
    var passHash = crypto.createHash('sha256').update(opts.reqData.password).digest('base64')
    var preTokenString = opts.reqData.username + passHash + opts.Terminal.terminalId;
    var token = new Buffer(preTokenString + Math.random().toString(36).slice(-8)).toString('base64');
    opts.token = token;
    next(null, opts);
}


function updateTerminal(args, next) {
    args.Terminal.userId = args.user;
    args.Terminal.terminalUserToken = args.token;
    args.Terminal.requestedRole = null;
    args.Terminal.modifiedOn = Date.now();

    var updater = args.Terminal.getUpdateHandler(args.req, args.res, {
        errorMessage: 'There was an error updating terminal:'
    });

    updater.process(args.req.body, {
        logErrors: true,
        fields: 'userId, terminalUserToken, modifiedOn'
    }, next);

    next(null, args);
}


/* */