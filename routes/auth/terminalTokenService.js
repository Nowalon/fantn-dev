var keystone = require('keystone'),
	async = require('async'),
	request = require('request'),
	_ = require('underscore'),
        Terminal = keystone.list('Terminal'),
	User = keystone.list('User');

function error(err, res) {
    return res.status(400).json({error: err});
}

function error401(err, res) {
    return res.status(401).json({error: err});
}

function error404(err, res) {
    return res.status(404).json({error: err});
}


exports = module.exports = function(req, res, next) {
    var body = req.body;
    var isValid = true, errPropMsg = "for request: '" + req.url + "' ";

        if (!body.token || !body.token.length) {
            errPropMsg += " 'token' property is required;";
            isValid = false;
        }
        
        if (isValid) {

            Terminal.model.queryOne({where: {'terminalUserToken': body.token}})
            .then(function (terminal) {
                    if (terminal) {
                        var dateNow = new Date();
                        var dateModifiedOn = new Date(terminal.modifiedOn);
                        var diffDays = dateNow.getDate() - dateModifiedOn.getDate();
                        if (diffDays > 30) {
                                terminal.requestedRole = null;
                                terminal.modifiedOn = Date.now();
                                terminal.terminalUserToken = "";

                                var updater = terminal.getUpdateHandler(req, res, {
                                    errorMessage: 'There was an error updating terminal:'
                                });

                                updater.process(req.body, {
                                    logErrors: true,
                                    fields: 'terminalUserToken, modifiedOn, requestedRole'
                                }, function(){
                                    error404('token expired', res);
                                });
                        } else {
                            var pattAuthorize = new RegExp("authorize_user");
                            var pattGetOwnerInfo = new RegExp("get_owner_info");
                            var pattInformStatus = new RegExp("inform_status");
                            var pattRegisterItemByTerm = new RegExp("register_item_by_term");
                            req.Terminal = terminal;
                            if (pattAuthorize.test(req.url)) {
                                next();
                            } else {
                                if (terminal.requestedRole && (terminal.requestedRole === 'PRO' || terminal.requestedRole === 'TAG')) {
                                    if (pattGetOwnerInfo.test(req.url)) {
                                        if (terminal.requestedRole === 'PRO') {
                                            next();
                                        } else {
                                            error401('unauthorized', res);
                                        }
                                    } else if (pattInformStatus.test(req.url)) {
                                        if (terminal.requestedRole === 'PRO') {
                                            next();
                                        } else {
                                            error401('unauthorized', res);
                                        }
                                    } else if (pattRegisterItemByTerm.test(req.url)) {
                                        if (terminal.requestedRole === 'PRO') {
                                            next();
                                        } else {
                                            error401('unauthorized', res);
                                        }
                                    }
                                } else {
                                    error401('unauthorized', res);
                                }
                            }
                        }
                    } else {
                        error404('unknown token', res);
                    }
            });
        } else {
            error(errPropMsg, res);
        }
};
