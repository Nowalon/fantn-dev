var keystone 		= require('keystone'),
	logger          = require('logfmt'),
	joinService		= require('../../../services/user/joinService'),
	async 			= require('async');

exports = module.exports = function(req, res) {

	if (req.user) {
		return res.redirect(req.cookies.target || '/me');
	}

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'session';
	locals.form = req.body;

	view.on('post', { action: 'join' }, function(next) {

		joinService(req.body, req, res, function (err) {

			if (err) {
				logger.log({type:'error', what: 'CREATE USER', email: req.body.email});
				res.redirect('/join');

			} else {

				logger.log({type:'info', what: 'CREATE USER', email: req.body.email});

				if (req.body.target && !/join|signin/.test(req.body.target)) {
					res.redirect('/register/RegisterName');
				} else {
					res.redirect('/me');
				}
			}
		});
	});

	view.render('session/join');
}
