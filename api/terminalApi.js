var updateQrCodeService = require('../services/user/updateQrCodeService'),
    terminalService = require('../services/user/terminalService'),
    authenticateTerminalService = require('../services/user/authenticateTerminalService'),
    authorizeTerminalService = require('../services/user/authorizeTerminalService'),
    getItemOwnerTerminalService = require('../services/user/getItemOwnerTerminalService'),
    createQrCodeService = require('../services/qrcode/createQrCode'),
    keystone            = require('keystone'),
    User                = keystone.list('User'),
    QrCode              = keystone.list('QrCode'),
    Terminal            = keystone.list('Terminal'),
    logger              = require('logfmt'),
    _                   = require('lodash'),
    routeUtils          = require('../lib/routeUtils'),
    utils               = require('../lib/routeUtils');

function error(err, res) {
    return res.status(400).json({error: err});
}

function error401(err, res) {
    return res.status(401).json({error: err});
}

function error404(err, res) {
    return res.status(404).json({error: err});
}

function escapeLand (land) {
    land = land || '';
    land = land.replace(/^00|^0|\+/, '');
    return land;
}


    // get all terminals
module.exports.getTerminal = function (req, res, next) {
    var body = req.body;
    Terminal.model.find()
    .exec()
    .then(function (terminals) {
        res.json({cnt: terminals.length, terminals: terminals});
    });
};


    // register terminal by UUID
module.exports.regTerminal = function (req, res, next) {
    var body = req.body;

    if(!req.body || !req.body.terminal_id){
        error("for request: /\api/\reg_terminal 'terminal_id' request parameter is required" , res);
    } else {
        if (!body.terminal_id.length /*|| body.terminal_id.length != 36*/) {
            error("for request: /\api/\reg_terminal 'terminal_id' property is not valid by length", res);
        } else {
            Terminal.model.find()
                    .where('terminalId', body.terminal_id)
                    .limit(5)
                    .exec()
                    .then(function(terminals) {
                        if (!terminals.length) {
                            terminalService({
                                terminalId: body.terminal_id
                            }, function(result) {
                                res.json({OK: 'terminal succesfully registered'});
                            });
                        } else {
                            res.json({OK: 'terminal already registered'});
                        }
                    });
    //    .then(utils.json.bind(null, res), utils.error.bind(null, res));
        }
    }
};


    // authenticateTerminalUser {email, pass, terminal_id}
module.exports.authenticateTerminalUser = function (req, res, next) {
    var body = req.body;
    var isValid = true, errPropMsg = "for request: /api/authenticate_user: ";

        if (!body.terminal_id || !body.terminal_id.length) {
            errPropMsg += " 'terminal_id' property is not provided or not valid by length;";
            isValid = false;
        }
        if (!body.username || !body.username.length) {
            errPropMsg += " 'username' property is required;";
            isValid = false;
        }
        if (!body.password || !body.password.length) {
            errPropMsg += " 'password' property is required;";
            isValid = false;
        }

        if (isValid) {
            User.model.queryOne({where: {'email': body.username}})
            .then(function (user) {
                    if (user) {
                        user._.password.compare(body.password, function(err, isMatch) {
                            if (!err && isMatch) {
                                return authenticateTerminalService({
                                    user: user,
                                    reqData: body,
                                    terminalId: body.terminal_id,
                                    req: req,
                                    res: res
                                })    .then(function (result) {
                                    res.json({token: result.Terminal.terminalUserToken});
                                    })
                                    .fail(function(err){
                                        error(err, res);
                                    }).done();
                            }
                            else {
                                var err = err || 'wrong password';
                                error(err, res);
                            }
                        });
                    } else {
                        error('user not found', res);
                    }
            });
//    .then(utils.json.bind(null, res), utils.error.bind(null, res));
        } else {
                error(errPropMsg, res);
        }
};



    // authorizeTerminalUser {token: <token>, requested_role: 'PRO'|'TAG'}
module.exports.authorizeTerminalUser = function (req, res, next) {
    var body = req.body;
    var isValid = true, errPropMsg = "for request: /api/authorize_user: ";

        if (!body.token || !body.token.length) {
            errPropMsg += " 'token' property is required;";
            isValid = false;
        }
        if (!body.requested_role || !body.requested_role.length) {
            errPropMsg += " 'requested_role' property is required;";
            isValid = false;
        }
        if (body.requested_role != 'PRO' && body.requested_role != 'TAG') {
            errPropMsg += " wrong 'requested_role' parameter value ('PRO'|'TAG');";
            isValid = false;
        }

        if (isValid) {
            return authorizeTerminalService({
                terminal: req.Terminal,
                reqData: body,
                token: body.token,
                req: req,
                res: res
            })    .then(function (result) {
                res.json({OK: 'terminal authorized', terminal: result.terminal});
            })
            .fail(function(err){
                error401(err, res);
            }).done();
    } else {
        error(errPropMsg, res);
    }
};


    //getOwnerInfo {token: <token>, item_id: <item_id>}
module.exports.getOwnerInfo = function (req, res, next) {
    var body = req.body;
    var isValid = true, errPropMsg = "for request: /api/get_owner_info: ";

        if (!body.token || !body.token.length) {
            errPropMsg += " 'token' property is required;";
            isValid = false;
        }
        if (!body.item_id || !body.item_id.length) {
            errPropMsg += " 'item_id' property is required;";
            isValid = false;
        }

        if (isValid) {
            return getItemOwnerTerminalService({
                serialNumber: body.item_id,
                reqData: body,
                req: req,
                res: res
            })    .then(function (result) {
                res.json({photo: result.Avatar, firstname: result.Owner.name.first, lastname: result.Owner.name.last, country: result.Owner.country, phone_numbers: result.phone_numbers});
            })
            .fail(function(err){
                error(err, res);
            }).done();
        } else {
            error(errPropMsg, res);
        }
};






/* */