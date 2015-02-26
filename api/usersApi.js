var updateQrCodeService = require('../services/user/updateQrCodeService'),
    createQrCodeService = require('../services/qrcode/createQrCode'),
    keystone            = require('keystone'),
    User                = keystone.list('User'),
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

module.exports.updateQrCode = function (req, res, next) {
    var user = req.user;
    var userId = req.params.userId;
    var qrCodeId = req.params.qrId;
    var body = req.body;

    if (user._id.toString() !== userId ) {
        next('You are not allowed to perform this operation');
    }

    var args = {userId : userId, qrCodeId : qrCodeId, body : body, req: req, res: res};

    updateQrCodeService(args)
    .then(function (result) {
        var item = result.item.toJSON();
        item.photo = result.item.avatarUrl;
        res.json(item);
    })
    .fail(next).done();
}


module.exports.createQrCodeForUser = function (req, res, next) {

    User.model.queryOne({where: {email : req.body.data.email}})
    .then(function (user) {

        return createQrCodeService({
            amount : 1,
            user : user
        });
    })
    .then(utils.json.bind(null, res), utils.error.bind(null, res));
}


module.exports.updateUser = function (req, res, next) {

    var body = req.body;

    // TODO: this validation should be shared with the front-end
    body.mobileLand = escapeLand(body.mobileLand);
    body.mobile2Land = escapeLand(body.mobile2Land);
    body.mobile3Land = escapeLand(body.mobile3Land);

    var requiredFields = ['firstName', 'lastName', 'adress', 'city', 'country', 'postCode',
    'mobile', 'email', 'mobileLand'];

    var isValid = _.every(requiredFields, function (field) {
        return body[field] && body[field].length && body[field].length >= 2;
    });

    if ( !isValid ) {
        logger.log(_.merge({type:'error', what: 'UPDATE USER FAILED'}, body));
        return next({error : 'Some fields are missing'});
    }

    body.name = {
        first: body.firstName,
        last: body.lastName
    };

    req.user.getUpdateHandler(req).process(body, {
        fields: 'name, adress, adress2, city, country, postCode, ' +
        'mobile, mobile2, mobile3, email, mobileLand, mobile2Land, ' +
        'mobile3Land, photo', flashErrors: true
    }, function(err, result) {


        if (err) {
            next(err);
        }

        var item = result.item.toJSON();
        item.photo = result.item.avatarUrl;

        logger.log({type:'info', what: 'UPDATE USER', email: req.body.email, mobile: req.body.mobile});

        res.send(_.omit(item, ['password']));
    });
}


module.exports.updateWithPaymentUser = function (req, res, next) {

    req.user.getUpdateHandler(req).process(req.body, {
        fields: 'paymentType, subscriptionType', flashErrors: true
    }, function(err, result) {

        if (err) { next(err); }

        logger.log({type:'info', what: 'UPDATE USER PAYMENT', paymentType: req.body.paymentType, subscriptionType: req.body.subscriptionType});

        var item = result.item.toJSON();
        res.send(_.omit(item, ['password', 'transactions']));
    });
}
