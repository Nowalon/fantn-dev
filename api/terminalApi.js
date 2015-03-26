var updateQrCodeService = require('../services/user/updateQrCodeService'),
    terminalService = require('../services/user/terminalService'), /* !!! terminalService !!! */
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

    if(!req.body.data || !req.body.data.length){
        error("for request: /api/test_reg_terminal 'terminal_id' property is required" , res);
    } else {
        var data = JSON.parse(req.body.data);
        if (!data.terminal_id.length || data.terminal_id.length < 36) {
            error("for request: /api/test_reg_terminal 'terminal_id' property is not valid by length", res);
        } else {
            Terminal.model.find()
                    .where('terminalId', data.terminal_id)
                    .limit(5)
                    .exec()
                    .then(function(terminals) {

                if (!terminals.length) {

                    terminalService({
                        terminalId: data.terminal_id
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
