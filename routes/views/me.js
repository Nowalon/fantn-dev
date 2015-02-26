var keystone 	= require('keystone'),
	_ 			= require('lodash'),
	QrCode      = keystone.list('QrCode'),
	appConstants = require('../../lib/shared/constants'),
	moment 		= require('moment');

function renderAmount (subscriptionType) {
	var _amount = appConstants.getSubscriptionPriceByLabel(subscriptionType);
	return  parseInt(_amount,10) / 100;
}

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.section = 'me';
	locals.page.title = 'Settings - FANTN';

	var user = req.user.toJSON();
	user.transactions = user.transactions.map(function (tr) {
		return {
			amount : renderAmount(tr.subscriptionType),
			createdAt : moment(tr.createdAt).format('MM-DD-YYYY'),
			subscriptionType : tr.subscriptionType
		};
	});

	user.photo = req.user.avatarUrl;
	if (req.user.avatarUrl && _.isFunction (req.user.avatarUrl)) {
		user.photo = req.user.avatarUrl();
	}

	view.query('qrCodes', QrCode.model.find()
			.where('owner', req.user.id)
			.sort('serialNumber'));

	view.render('site/me', {user: JSON.stringify(user)});
}
