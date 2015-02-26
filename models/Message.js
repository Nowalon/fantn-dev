var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Messages Model
 * =============
 */

var Message = new keystone.List('Message', {});

Message.add({
    messageId : {type: Number},
    nor: {type : String},
    fr: {type : String},
    gr: {type : String},
    it: {type : String},
    pt: {type : String},
    es: {type : String},
    dk: {type : String},
    en: {type : String}
});

Message.register();
