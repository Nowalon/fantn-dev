// performance
// require('newrelic');
var memwatch = require('memwatch');
//
memwatch.on('leak', function(info) {
	console.log('WARNING: ' + JSON.stringify(info));
});

// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone 	= require('keystone'),
	handlebars 	= require('express-handlebars'),

	// other requires
	logger 		= require('logfmt'),
	// cpus 		= require('os').cpus().length,
	throng 		= require('throng'),
	config 		= require('./lib/config'),
	http 		= require('http');


	// Let it all begin
http.globalAgent.maxSockets = Infinity;
throng(startRollin, { workers: config.concurrency });
// startRollin();

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
function initKeystone() {
	keystone.init({

		'name': 'fantn',
		'brand': 'fantn',
		'static': 'public',
		'favicon': 'public/favicon.ico',
		'views': 'templates/views',
		'view engine': 'hbs',
		'mongo': config.mongo_url,

		'custom engine': handlebars.create({
			layoutsDir: 'templates/views/layouts',
			partialsDir: 'templates/views/partials',
			defaultLayout: 'default',
			helpers: new require('./templates/views/helpers')(),
			extname: '.hbs'
		}).engine,

		'emails': 'templates/emails',

		'auto update': true,
		'session': true,
		'auth': true,
		'user model': 'User',
		'cookie secret': '1?$VBE=f>y1gH^C#(l-S>?JV_$&v|obEu7S89[>xVF_EpG<`DX&JirG)~26d0SqJ',
	});

	// cloudinary
	keystone.set('cloudinary config', { cloud_name: 'fantn', api_key: '287114433772663', api_secret: 'TyGKINnYMV4R-JDyFFtP4SOyQ6yXDa7PStTdzR9g' });

	// mandrill
	keystone.set('mandrill api key', 'ft5pmj-khE04NmOw-MPfVQ');
	keystone.set('mandrill username', 'michaelgunnulfsen@gmail.com');

	// Load your project's Models
	keystone.import('models');

	// Setup common locals for your templates. The following are required for the
	// bundled templates and layouts. Any runtime locals (that should be set uniquely
	// for each request) should be added to ./routes/middleware.js

	keystone.set('locals', {
		_: require('lodash'),
		env: keystone.get('env'),
		utils: keystone.utils,
		editable: keystone.content.editable
	});

	var routes = require('./routes');
	keystone.set('routes', routes);

	// Setup common locals for your emails. The following are required by Keystone's
	// default email templates, you may remove them if you're using your own.

	keystone.set('email locals', {
		logo_src: '/images/fantn_logo_lg.jpg',
		logo_width: 194,
		logo_height: 76,
		theme: {
			email_bg: '#f9f9f9',
			link_color: '#2697de',
			buttons: {
				color: '#fff',
				background_color: '#2697de',
				border_color: '#1a7cb7'
			}
		},
		utils: keystone.utils,
		host: (function() {
			if (keystone.get('env') === 'development') return 'http://fantn.herokuapp.com';
			if (keystone.get('env') === 'production') return 'http://fantn.herokuapp.com';
			return (keystone.get('host') || 'http://localhost:') + (keystone.get('port') || '5000');
		})()
	});

	require('./services/payment/paypalService').init(config.paypal);


	// Setup replacement rules for emails, to automate the handling of differences
	// between development a production.

	// Be sure to update this rule to include your site's actual domain, and add
	// other rules your email templates require.

	keystone.set('email rules', [{
		find: '/images/',
		replace: (keystone.get('env') === 'production') ? 'http://fantn.herokuapp.com/images/' : 'http://localhost:5000/images/'
	}, {
		find: '/keystone/',
		replace: (keystone.get('env') === 'production') ? 'http://fantn.herokuapp.com/keystone/' : 'http://localhost:5000/keystone/'
	}]);

	// Load your project's email test routes

	keystone.set('email tests', require('./routes/emails'));

	// Configure the navigation bar in Keystone's Admin UI
	keystone.set('nav', {
		'users': 'users'
	});
}




function startRollin() {

	logger.log({
		type: 'info',
		msg: 'Starting server',
		env : process.env.NODE_ENV,
		concurrency: config.concurrency,
		thrifty: config.thrifty,
		timeout: config.timeout,
		busy_ms: config.busy_ms
	});

	initKeystone();
	var instance = require('./lib/app')(config, null);
	keystone.set('sharedApp' , instance);

	instance.on('ready', createServer);
	instance.on('lost', abort);

	// Starts keystone and stuff
	function createServer() {

		if (config.thrifty){
			instance.startWorking();
		}

		try {

			process.on('SIGTERM', shutdown);

			instance
			.removeListener('lost', abort)
			.on('lost', shutdown);

			keystone.start();

		}catch(e) {
			logger.log({ type: 'error', msg: 'something broke: ' + e });
			process.exit();
		}

		function shutdown() {
			logger.log({ type: 'info', msg: 'shutting down' });

			try {

				keystone.httpServer.close(function() {
					logger.log({ type: 'info', msg: 'exiting' });
					process.exit();
				});

			}catch(e) {
				logger.log({ type: 'error', msg: 'failed to exit. exiting' });
				process.exit();
			}
		}
	}

	function abort() {
		logger.log({ type: 'info', msg: 'shutting down', abort: true });
		process.exit();
	}
}
