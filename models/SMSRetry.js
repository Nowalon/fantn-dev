var keystone = require('keystone'),
    Types = keystone.Field.Types;

var SMSRetry = new keystone.List('SMSRetry', {
    autokey: { path: 'slug', from: 'contact1GSM', unique: true },
    defaultSort: '-createdAt'
});


SMSRetry.add({

    issueId : { type: Types.Relationship, ref: 'Issue' },
    qrCode  : { type: Types.Relationship, ref: 'QrCode' },
    ownerName : { type : String},

    // owner first then other user's registered contacts WITHOUT Country prefix
    contact1GSM : {type: String},
    contact2GSM : {type: String},
    contact3GSM : {type: String},

    // country code prefix for mobile numbers
    contact1GSMCtry : {type: String},
    contact2GSMCtry : {type: String},
    contact3GSMCtry : {type: String},

    // 1, 2, 3, 4 (Fantn is always number 4)
    retries : {type: Types.Number, default: 1},
    createdAt: { type: Date, default: Date.now }
});

SMSRetry.schema.methods.createACKMessage = function () {
    return 'A' + this._id;
}

SMSRetry.register();
