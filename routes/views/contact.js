var keystone 	= require('keystone'),
	config 		= require('../../lib/config')
	logger		= require('logfmt');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'about';
	locals.page.title = 'About FantN';

	view.on('post', { action: 'contact' }, function(next) {

		if (!req.body.email) {
			req.flash('error', 'Epost er obligatorisk.');
			return next();
		}

		new keystone.Email('contact-email').send({
			subject: 'FANTN contact melding',
			to: config.email.toAddr,
			name : req.body.name || 'Ikke angitt',
			email : req.body.email,
			text : req.body.text,
			from: {
				name: 'Fantn AS',
				email: 'fantn@fantn.no'
			}
		}, function (err) {
			if (err) {
				req.flash('error', 'Noe gikk galt under sending av beskjeden');
				next(err);
			} else {
				logger.log({type: 'info', what : 'EMAIL-SEND', name : req.body.email});
				req.flash('success', 'Tusen takk! Vi setter stor pris på din tilbakemelding');
				res.redirect('/contact');
			}
		});
	});

	view.render('site/contact');

}
