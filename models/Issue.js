var keystone = require('keystone'),
    moment   = require('moment'),
    Types = keystone.Field.Types;

var Issue = new keystone.List('Issue', {
});

Issue.add({
    serialNumber : { type: String },

    // E.g "90052300"
    findersGSM : { type: String },

    findersLand : { type: String },

    // E.g "47-telenor", "47-networknorway"
    findersOperator : { type: String },

    // alweays empty
    description : { type: String },

    // the owner of the qrCode (e.g serialNumber)
    userId: { type: Types.Relationship, ref: 'User' },

    // for simplicity
    qrCode: { type: Types.Relationship, ref: 'QrCode'},

    issueSolved : { type: Boolean, default : false },
    createdOn : {type: Types.Datetime, default: Date.now},
    modifiedOn : {type: Types.Datetime, default: Date.now},
    events: { type: Types.Relationship, ref: 'Event', many: true },
    ownerMobile : { type: Types.Text }
});


Issue.schema.statics.queryOne = function (opts) {
    return this.findOne()
    .where(opts.where)
    .exec();
}


Issue.schema.virtual('timestamp').get(function() {
    return this._.createdOn.format();
});



Issue.register();
