var q               = require('q'),
    _               = require('lodash'),
    async           = require('async'),
    logger          = require('logfmt'),
    keystone        = require('keystone'),
    Issue           = keystone.list('Issue'),
    SMSRetry        = keystone.list('SMSRetry'),
    SMSRetryUnit    = keystone.list('SMSRetryUnit'),
    Event           = keystone.list('Event'),
    sendSmsService  = require('./sendSMSService');



/**
*
* User confirmed he got the item found sms
*
* Send SMS back to him with contact info for the finder
*
* @body of the sms received
*/
module.exports = function (body, models) {
    var def = q.defer();

    async.waterfall([
        getUnsolvedIssueBySMSRetryId.bind(null, body),
        registerFantnUserConfirmed,
        sendContactSMSToUser,
        deleteSMSRetryObj

    ], function (err) {
        if(err) { return def.reject(err); }
        def.resolve('NORETURN');
    });


    return def.promise;
}



function getUnsolvedIssueBySMSRetryId (body, next) {

    var currIssue;


    Issue.model.queryOne({
        where : { _id : body.__smsRetry.issueId, issueSolved : false },
        sort : {createdOn : -1}
    })
    .then(function (issue) {

        if (!issue) {
            logger.log({ type: 'info', msg: 'failed to find issue', });
            next(true);
        }

        logger.log({ type: 'info', msg: 'Issue Found', issueId : issue._id, serialNumber : issue.serialNumber});

        // be sure that there is an event for it too.
        currIssue = issue;
        return Event.model.queryOne({
             where : { issueId : issue._id, action : 'Fantn User Contacted' }
        });
    }, next)

    // issue found
    .then(function (event) {
        if (!event) { return next(true);}

        next(null, body, currIssue);
    }, next)
}

function registerFantnUserConfirmed (body, issue, next) {

    var event = new Event.model({
        action : 'Fantn User Confirmed',
        actionText : 'Sent contact details to Fantn user',
        issueId : issue._id,
        qrCode : issue.qrCode,
        mobileNumber : body.gsm
    });

    event.save(function (e, event) {
        if (e) {logger.log({type:'error', msg : 'failed to save event'}); return next(e); }

        next(null, body, issue);
    });
}

function sendContactSMSToUser (body, issue, next) {
    sendSmsService({
        messageId : 3,
        number : body.gsm,
        land : body.land,
        finderGsm : ('+' + issue.findersLand + ' ' + issue.findersGSM)
    })
    .then (function (res) {
        next(null, body, issue);
    })
    .fail(function(err) {
        next(err);
    });
}

function deleteSMSRetryObj (body, issue, next) {
    var id = body.__smsRetry._id;

    SMSRetryUnit.model.remove({smsRetry : id}, function (err) {

        if (err) {
            logger.log({ type: 'error', msg: 'Failed to remove SMSRetryUnit object ' + err });
        } else {
            logger.log({ type: 'info', msg: 'REMOVED SMSRETRYUNIT', _id : id });
        }

        SMSRetry.model.remove({_id : id}, function (err, res) {

            if (err) {
                logger.log({ type: 'error', msg: 'Failed to remove SMSRetry object ' + err });
            } else {
                logger.log({ type: 'info', msg: 'REMOVED SMSRETRY', _id : id });
            }

            next(null, body, issue);
        });

    });
}
