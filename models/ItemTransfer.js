var keystone = require('keystone'),
    Types = keystone.Field.Types;

var ItemTransfer = new keystone.List('ItemTransfer', {});

ItemTransfer.add({
    terminalId: { type: Types.Relationship, ref: 'Terminal' },
    userId: { type: Types.Relationship, ref: 'User' },
    qrCode  : { type: Types.Relationship, ref: 'QrCode' },
        // "{geo: [lng,lat]}"
    location : { type : Types.Location },
    geoLoc_latitude: { type: String },
    geoLoc_longitude:  { type: String },
    createdOn : {type: Types.Datetime, default: Date.now},
    modifiedOn : {type: Types.Datetime, default: Date.now},
});

ItemTransfer.schema.statics.queryOne = function (opts) {
    return this.findOne()
    .where(opts.where)
    .exec();
};

ItemTransfer.register();
