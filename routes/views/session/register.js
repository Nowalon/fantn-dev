'use strict';
var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'me';
	locals.user = req.user;
	locals.state = JSON.stringify({user : locals.user});

	view.render('session/register');
}
