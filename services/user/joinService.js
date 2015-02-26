var keystone = require('keystone'),
    async = require('async');

/**
* Creates a new User
*/
module.exports = function (body, req, res, next) {
    async.series([

        function(cb) {

            if (!body.email || !body.password) {
                var error = 'Du må fylle inn epost og passord.';
                req.flash('error', error);
                cb(error);
            } else {
                cb();
            }
        },

        function(cb) {

            keystone.list('User').model.findOne({ email: body.email }, function(err, user) {

                if (err || user) {
                    var error = 'En bruker med denne epostadressen finnes allerede.';
                    req.flash('error', error);
                    cb(error);
                } else {
                    cb();
                }

            });

        },

        function(cb) {

            var userData = {
                name: {
                    first: body.firstname,
                    last: body.lastname,
                },
                email: body.email,
                password: body.password,
                isAdmin: false
            };

            var User = keystone.list('User').model,
                newUser = new User(userData);

            newUser.save(function(err) {
                return cb(err);
            });
        }

    ], function(err) {

        if (err) {
            return next(err);
        }

        var onSuccess = function() {
            return next();
        };

        var onFail = function(e) {
            req.flash('error', 'Det oppstod en feil. Prøv igjen.');
            return next(true);
        }

        keystone.session.signin({ email: body.email, password: body.password }, req, res, onSuccess, onFail);
    });
}
