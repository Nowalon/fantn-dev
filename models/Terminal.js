var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Terminal = new keystone.List('Terminal', {
    autokey: { path: 'terminalId', from: 'id', unique: true },
    defaultSort: '-createdOn'
});

Terminal.add({
    terminalId : { type: String, required: true, default: '', unique: true },
    terminalUserToken : { type: String, default: '' },
        // the owner of the terminal
    userId: { type: Types.Relationship, ref: 'User', index: true },
        // "90052300"
    mobileNumber : { type : Types.Text },
    createdOn : {type: Types.Datetime, default: Date.now},
    modifiedOn : {type: Types.Datetime, default: Date.now},
});

Terminal.schema.statics.queryOne = function (opts) {
    return this.findOne()
    .where(opts.where)
    .exec();
};

Terminal.register();
