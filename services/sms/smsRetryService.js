var q = require('q');
var keystone = require('keystone');
var SMSRetry = keystone.list('SMSRetry');
var SMSRetryUnit = keystone.list('SMSRetryUnit');
var sendSMSService = require('./sendSMSService');
var smsConstants = require('./smsConstants');
var scheduleRetryService = require('./scheduleRetryService');
var logger = require('logfmt');


function updateSMSRetryAndResolve (def, smsRetry, removeRetry) {
    if (removeRetry) {
        SMSRetryUnit.model.remove({smsRetry : smsRetry._id}, function (err) {

            if (err) {
                logger.log({ type: 'error', msg: 'Failed to remove SMSRetryUnit object ' + err });
            } else {
                logger.log({ type: 'info', msg: 'REMOVED SMSRETRYUNIT', _id : smsRetry._id });
            }

            SMSRetry.model.remove({_id : smsRetry._id}, function (err) {
                if (err) {
                    logger.log({type: 'error', what: 'Failed to remove SMSRetry', id : smsRetry._id, err: err});
                } else {
                    logger.log({type: 'info', what: 'SMSRetry removed', id : smsRetry._id});
                }
                def.resolve('NORETURN');
            });
        });
    } else {
        smsRetry.save(function () {
            def.resolve('NORETURN');
        });
    }
}

module.exports = smsRetryService = function (retryId) {
    var def = q.defer(), smsRetry, removeRetry, messageId, receiverGsm;

    SMSRetry.model.findOne({_id : retryId})
    .populate('qrCode')
    .exec()
    .then(function findSuccess(res) {
        if (!res) {
            logger.log({type : 'error', what : 'SMS RETRY', msg:'Could not find SMSRetry object',
                retryId : retryId});
            def.reject();
        }

        smsRetry = res;

        // send sms to the next contact and increment retries
        smsRetry.retries ++;
        receiverGSM = smsRetry.toJSON()['contact' + smsRetry.retries + 'GSM'];
        messageId = smsConstants.msgIds.RETRY_NORMAL;

        if (!receiverGSM) {
            // send sms to Fantn
            receiverGSM = smsConstants.fantnGSM;
            messageId = smsConstants.msgIds.RETRY_FANTN;
            removeRetry = true;
        }

        logger.log({type : 'info', msg : 'SEND SMS RETRY', retryId : retryId,
            retries : smsRetry.retries, to: receiverGSM, messageId : messageId});


        scheduleRetryService(smsRetry.toJSON());

        return SMSRetryUnit.model.createUnit({gsm : receiverGSM, smsRetryId : smsRetry._id});


    }, function findErr(err) {
        fail(def, retryId);
    })
    .then(function (smsRetryUnit) {
        return sendSMSService({
            messageId : messageId,
            fullnumber : receiverGSM,
            smsRetry : smsRetry,
            smsRetryUnit : smsRetryUnit
        });
    })
    .then(function smsSuccess (res) {
        // must persist updated retries
        updateSMSRetryAndResolve(def, smsRetry, removeRetry)
    }, function () {
        def.reject();
    });

    return def.promise;
}
