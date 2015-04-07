var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	api: importRoutes('../api'),
	views: importRoutes('./views'),
	auth : importRoutes('./auth')
};

// Setup Route Bindings
exports = module.exports = function(app) {

	// Allow cross-domain requests (development only)
	if (process.env.NODE_ENV != 'production') {
		console.log('------------------------------------------------');
		console.log('Notice: Enabling CORS for development.');
		console.log('------------------------------------------------');
		app.all('*', function(req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type');
			next();
		});
	}

	// API

	// Sms incoming
	app.get('/api/smsapi', routes.api.smsApi.getPullMessage);

	// retries
	app.get('/api/smsapi/retries/:retryId', routes.api.smsApi.retry);

	// Users
	app.all('/api/users/:userId/updateUser', middleware.requireUser, routes.api.usersApi.updateUser);
	app.post('/api/users/:userId/updateUserPayment', middleware.requireUser, routes.api.usersApi.updateWithPaymentUser);
	app.all('/api/users/:userId/qrCodes/:qrId', middleware.requireUser, routes.api.usersApi.updateQrCode);
	app.post('/api/users/:userId/qrCodes', middleware.requireUser, routes.api.usersApi.createQrCodeForUser);

	// Payment

	// mobile
	app.post('/api/users/:userId/payment/chargeMobile',  middleware.requireUser, routes.api.payment.chargeMobile);

	// stripe
	app.post('/api/users/:userId/payment/chargeStripe', middleware.requireUser, routes.api.payment.chargeStripe);

/***/        //REST for Mobile App
        app.all('/api/get_terminals', routes.api.terminalApi.getTerminal);

        app.post('/api/reg_terminal', routes.api.terminalApi.regTerminal);
        app.post('/api/authenticate_user', routes.api.terminalApi.authenticateTerminalUser);
        app.post('/api/authorize_user', routes.auth.terminalTokenService, routes.api.terminalApi.authorizeTerminalUser);
        app.post('/api/get_owner_info', routes.auth.terminalTokenService, routes.api.terminalApi.getOwnerInfo);


	// paypal
	app.all('/api/users/:userId/payment/chargePaypal', middleware.requireUser, routes.api.payment.chargePaypal);
	app.all('/api/payment/paypal/execute', middleware.requireUser, routes.api.payment.executePaypal);
	app.all('/api/payment/paypal/cancel', middleware.requireUser, routes.api.payment.cancelPaypal);
	app.get('/api/payment/paypal/recurring/execute', middleware.requireUser, routes.api.payment.executePaypalSubscription);
	app.get('/api/payment/paypal/recurring/cancel', middleware.requireUser, routes.api.payment.cancelPaypalSubscription);

	// Views
	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	app.get('/faq', routes.views.faq);
	app.get('/tc', routes.views.termsAndCondition);
	app.all('/contact', routes.views.contact);

	// Session
	app.all('/join', routes.views.session.join);
	app.all('/prereg', routes.views.session.prereg);
	app.all('/signin', routes.views.session.signin);
	app.all('/signout', routes.views.session.signout);
	app.all('/fantnadmin', middleware.requireUser, middleware.requireFantnAdmin, routes.views.admin.fantnAdmin);
	app.all('/forgot-password', routes.views.session.forgotPassword);
	app.all('/reset-password/:key', routes.views.session.resetPassword);

	app.all('/register', middleware.requireUser, routes.views.session.register);
	app.all('/register/RegisterName', middleware.requireUser, routes.views.session.register);
	app.all('/register/RegisterSubscription', middleware.requireUser, routes.views.session.register);
	app.all('/register/RegisterFinish', middleware.requireUser, routes.views.session.register);


	// user
	app.all('/me*', middleware.requireUser);
	app.all('/me', routes.views.me);
	app.all('/me/payments', routes.views.me);
	app.all('/me/profile', routes.views.me);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	app.all('/auth/confirm', routes.auth.confirm);
	app.all('/auth/:service', routes.auth.service);

};
