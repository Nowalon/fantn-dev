var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var deps = {
	facebook: { 'services.facebook.isConfigured': true }
}

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true},
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: { type: String, hidden: true },

	// TODO: update with googlemaps api
	adress: { type: Types.Text, initial: true },
	adress2: { type: Types.Text, initial: true },
	city: { type: Types.Text, initial: true },
	country: { type: Types.Text, initial: true, default: 'Norge' },
	postCode : { type: Types.Text, initial: true },
	mobile : { type: Types.Text, initial: true },
	mobile2 : { type: Types.Text, initial: true },
	mobile3 : { type: Types.Text, initial: true },
	photo: { type: Types.CloudinaryImage },
	mobileLand : {type: Types.Text, default: '47'},
	mobile2Land : {type: Types.Text},
	mobile3Land : {type: Types.Text},
	isActive : {type : Boolean, default : false},

	// payment
	subscriptionType : {type : String},
	// mobile, stripe or paypal
	paymentType : {type : String}

},'Services', {
	services: {
		facebook: {
				isConfigured: { type: Boolean, label: 'Facebook has been authenticated' },

				profileId: { type: String, label: 'Profile ID', dependsOn: deps.facebook },

				username: { type: String, label: 'Username', dependsOn: deps.facebook },
				avatar: { type: String, label: 'Image', dependsOn: deps.facebook },

				accessToken: { type: String, label: 'Access Token', dependsOn: deps.facebook },
				refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.facebook }
			}
		}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

User.schema.add({
	transactions: [{
		amount: String,
		subscriptionType : String,
		createdAt: Date,
		customerId : String //only for subscription
	}]
});

User.schema.add({
	agreement: {}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.schema.virtual('avatarUrl').get(function() {
	if (this.photo.exists) return this._.photo.src;

	if (this.services.facebook.isConfigured && this.services.facebook.avatar) return this.services.facebook.avatar;
});

User.schema.virtual('getMobile1')

User.schema.methods._mobile = function (land, mobile) {
	var that = this;
	if (!that[land] || !that[mobile]) { throw new Error('User does not have ' + mobile)}

	return that[land] + that[mobile];
}

User.schema.methods._hasMobile = function (land, mobile) {
	var that = this;
	if (!that[land] || !that[mobile]) {return false;}
	else { return true; }
}

User.schema.methods.toMobile1 = function() {
	return this._mobile('mobileLand', 'mobile');
}

User.schema.methods.toMobile2 = function() {
	return this._mobile('mobile2Land', 'mobile2');
}

User.schema.methods.toMobile3 = function() {
	return this._mobile('mobile3Land', 'mobile3');
}


User.schema.methods.hasMobile1 = function() {
	return this._hasMobile('mobileLand', 'mobile');
}

User.schema.methods.hasMobile2 = function() {
	return this._hasMobile('mobile2Land', 'mobile2');
}

User.schema.methods.hasMobile3 = function() {
	return this._hasMobile('mobile3Land', 'mobile3');
}


User.schema.methods.resetPassword = function(callback) {

	var user = this;

	user.resetPasswordKey = keystone.utils.randomString([16,24]);

	user.save(function(err) {

		if (err) return callback(err);

		new keystone.Email('forgotten-password').send({
			user: user,
			link: '/reset-password/' + user.resetPasswordKey,
			subject: 'Forny Ditt Fantn Passord',
			to: user.email,
			from: {
				name: 'Fantn',
				email: 'contact@fantn.no'
			}
		}, callback);

	});

}


User.schema.statics.queryOne = function (opts) {
	return this.findOne()
	.where(opts.where)
	.exec();
}


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';

User.register();
