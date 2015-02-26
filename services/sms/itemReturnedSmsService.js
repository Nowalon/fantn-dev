var q               = require('q'),
    _               = require('lodash'),
    async           = require('async'),
    keystone        =require('keystone'),
    appConstants    = require('../../lib/shared/constants'),
    Issue           = keystone.list('Issue'),
    Event           = keystone.list('Event'),
    sendSmsService  = require('./sendSMSService');

/**
*
* Item was scanned again by looser. Found = success
*
* @body of the sms received
*/
module.exports = function (body, qrCode, issue, models) {
    var def = q.defer();

    async.waterfall([
        _.partial(sendItemReturnedSMSToUser, body, qrCode, issue),
        sendThankYouSMSToFinder,
        registerItemReturned,
        setStateOnQrCode

    ],function (err) {
        if (err) { console.log('Failed to save: ' + err); return def.reject(err); }

        console.log('Successfull Item Return!');
        def.resolve('NORETURN');
    });

    return def.promise;
}

/**
*
* ASYNC#exports#0
*
*/
function sendItemReturnedSMSToUser(body, qrCode, issue, next) {
    sendSmsService({
        messageId : 4,
        number : body.gsm,
        name : qrCode.name,
        land : body.land
    })
    .then (function (res) {
        next(null, body, qrCode, issue);
    }, next);
}

function sendThankYouSMSToFinder (body, qrCode, issue, next) {
    sendSmsService({
        messageId : 5,
        number : issue.findersGSM,
        land : issue.findersLand
    })
    .then (function (res) {
        next(null, body, qrCode, issue);
    }, next);
}

function registerItemReturned (body, qrCode, issue, next) {

    var event = new Event.model({
        action : 'Item Returned',
        actionText : 'User confirmed returned Item',
        issueId : issue._id,
        qrCode : qrCode._id,
        mobileNumber : body.gsm
    });

    event.save(function(e, event) {
        if (e) {console.log('Failed to save event ' + e); }

        issue.issueSolved = true;
        issue.save(function (err, res) {
            next(null, body, qrCode, issue);
        });
    });
}

function setStateOnQrCode (body, qrCode, issue, next) {
    qrCode.selectedStatus = appConstants.qrCodes.AVAILABLE;

    qrCode.save(function (err, res) {
        if (err) { logger.log({type:'error', msg : 'Failed to update qr code state ' + err}); }
        next(null, body, qrCode, issue);
    });
}
