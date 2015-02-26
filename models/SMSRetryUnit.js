var keystone = require('keystone'),
    q = require('q'),
    _ = require('lodash'),
    logger = require('logfmt'),
    Types = keystone.Field.Types;

var SMSRetryUnit = new keystone.List('SMSRetryUnit', {
    autokey: { path: 'slug', from: 'gsm', unique: true },
    defaultSort: '-createdAt'
});


SMSRetryUnit.add({
    smsRetry : { type: Types.Relationship, ref: 'SMSRetry' },
    counter : {type : Types.Number},
    gsm : {type : String},
    createdAt: { type: Date, default: Date.now }
});

SMSRetryUnit.schema.methods.createACKMessage = function () {
    return 'A' + this.counter;
}

SMSRetryUnit.schema.statics.createUnit = function (opts) {
    var def = q.defer();

    SMSRetryUnit.model.find({gsm : opts.gsm})
    .exec()
    .then(function retryUnitSuccess(res) {

        var retryUnit = new SMSRetryUnit.model({
            gsm : opts.gsm,
            smsRetry : opts.smsRetryId
        });

        // find the next counter
        if (res.length === 0) {
            retryUnit.counter = 1;
        } else {

            var counters = _.pluck(res, 'counter');

            counters.forEach(function (c, i) {
                if (counters.indexOf(i+1) === -1) {
                    retryUnit.counter = i;
                }
            });

            // if non exists, pick the next (i.e the list is continous)
            if (!retryUnit.counter) {
                retryUnit.counter = counters.length + 1;
            }
        }

        retryUnit.save(function(err, result) {
            if (err) {
                logger.log({type : 'error', what : 'FAILED TO CREATE SMSRETRYUNIT', err: err});
                def.reject(err);
            } else {
                logger.log({type : 'info', what : 'CREATED SMSRETRYUNIT', counter: retryUnit.counter, gsm: retryUnit.gsm});
                def.resolve(retryUnit);
            }
        });



    }, function retryUnitFail(err) {
        logger.log({type : 'error', what : 'FAILED TO FIND SMSRETRYUNIT', err: err});
        def.reject(err);
    });

    return def.promise;
}

SMSRetryUnit.register();
