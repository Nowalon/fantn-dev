var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Event = new keystone.List('Event', {});

Event.add({
    // Same issue ID for multiple connected events. Eg "1"
    issueId : { type: Types.Relationship, ref: 'Issue' },

    qrCode  : { type: Types.Relationship, ref: 'QrCode' },

    // "Item found", "Fantn User Contacted", "Finder Contacted", "Fantn User Confirmed", "Item Returned",
    action  : { type : String },

    // "Sent notification to fantn user (when action=Fantn user contacted)"
    // "Sent notification to finder (when action="Finder Contacted")",
    // "Sent contact details to fantn user (when action="Fantn user confirmed")"
    // "User confirmed returned item (when action="item returned")"
    actionText : { type : String },

    // "90052300"
    mobileNumber : { type : String },

    createdOn : {type: Types.Datetime, default: Date.now},
    modifiedOn : {type: Types.Datetime, default: Date.now},
});

Event.schema.statics.queryOne = function (opts) {
    return this.findOne()
    .where(opts.where)
    .exec();
}

Event.register();
