var keystone = require('keystone'),
    Types = keystone.Field.Types;

var ItemTransfer = new keystone.List('ItemTransfer', {
//    autokey: { path: 'terminalId', from: 'id', unique: true },
//    defaultSort: '-createdOn'
});

ItemTransfer.add({
//    terminalId : { type: String, required: true, default: '', unique: true },
//    terminalUserToken : { type: String, default: '' },
        // the owner of the terminal
    terminalId: { type: Types.Relationship, ref: 'Terminal' },
    userId: { type: Types.Relationship, ref: 'User' },
    qrCode  : { type: Types.Relationship, ref: 'QrCode' },

//    itemId: { type: Types.Relationship, ref: 'User', index: true },
        // "90052300"
    location : { type : Types.Location },
    geoLoc_latitude: { type: String },
    geoLoc_longitude:  { type: String },
//    geoInfo: { type: Types.NumberArray },
    
    
    
//    requestedRole : { type : Types.Text, default: null },
    createdOn : {type: Types.Datetime, default: Date.now},
    modifiedOn : {type: Types.Datetime, default: Date.now},
});

ItemTransfer.schema.statics.queryOne = function (opts) {
    return this.findOne()
    .where(opts.where)
    .exec();
};


ItemTransfer.register();
