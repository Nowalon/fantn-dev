var q           = require('q'),
    keystone    = require('keystone');
    User        = keystone.list('User');

module.exports = function () {
    var def = q.defer();

    User.model.find().exec(function (err, result) {

        if(err) {
            return def.reject(err);
        } else {
            return def.resolve(result);
        }
    });

    return def.resolve;
}
