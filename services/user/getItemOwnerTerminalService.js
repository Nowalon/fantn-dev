var q           = require('q'),
    keystone    = require('keystone'),
    User        = keystone.list('User'),
    QrCode      = keystone.list('QrCode'),
    Terminal    = keystone.list('Terminal'),
    async       = require('async'),
    _           = require('lodash');
var crypto = require('crypto');
var request = require('request');

function error404(err, res) {
    return res.status(404).json({error: err});
}

module.exports = function (args) {
    var def = q.defer();

    async.waterfall([

        getItem.bind(null, args),
        getItemOwner,
        getOwnerPhotoSource

    ], function (err, res) {
        if(err) { return def.reject(err);}
        def.resolve(res);
    });

    return def.promise;
};


function getItem(args, next) {
    QrCode.model.findOne({serialNumber : args.serialNumber}).exec(function (err, resItem) {
        if (err) { return next(err); }
        if (!resItem) { return next({error: 'item not found'}); }
        args.Item = resItem;
        next(null, args);
    });
}


function getItemOwner(args, next) {

    var ownerId = args.Item.owner.toString();
    User.model.findOne({_id : ownerId}).exec(function (err, resOwner) {
        if (err) { return next(err); }
        if (!resOwner) { error404('owner not found', args.res); } else {
            args.phone_numbers = [];
            if (resOwner.hasMobile1()) { args.phone_numbers.push(resOwner.toMobile1()); }
            if (resOwner.hasMobile2()) { args.phone_numbers.push(resOwner.toMobile2()); }
            if (resOwner.hasMobile3()) { args.phone_numbers.push(resOwner.toMobile3()); }
            args.Owner = resOwner;
            next(null, args);
        }
    });
}


function getOwnerPhotoSource(args, next){
    if (typeof args.Owner.avatarUrl == 'function') {
        var avatarUrl = args.Owner.avatarUrl();
        loadBase64Image(avatarUrl, function(err, image, prefix){
            if(err){
                args.Avatar = null;
                next(null, args);
            } else {
                args.Avatar = prefix + image;
                next(null, args);
            }
        });
    } else {
        args.Avatar = null;
        next(null, args);
    }
}


var loadBase64Image = function (url, callback) {
    // Required 'request' module:  var request = require('request');

    // Make request to our image url
    request({url: url, encoding: null}, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            // So as encoding set to null then request body became Buffer object
            var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
                , image = body.toString('base64');
            if (typeof callback == 'function') {
                callback(err, image, base64prefix);
            }
        } else {
//            throw new Error('Can not download image');
            var nErr = new Error('Can not download image');
            callback(nErr, null, null);
        }
    });
};



