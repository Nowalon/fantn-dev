var keystone = require('keystone'),
    Types = keystone.Field.Types;

var PreUser = new keystone.List('PreUser', {
    autokey: { path: 'slug', from: 'title', unique: true }
});

PreUser.add({
    email: { type: Types.Email, initial: true, unique: true },
    mobile : { type: Types.Text, initial: true, unique: true },
    createdAt: {type: Date, default: Date.now}
});

PreUser.defaultColumns = 'email';

PreUser.register();
