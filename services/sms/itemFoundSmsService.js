var q               = require('q'),
    _               = require('lodash'),
    async           = require('async'),
    keystone        = require('keystone'),
    logger          = require('logfmt'),
    appConstants    = require('../../lib/shared/constants'),
    Issue           = keystone.list('Issue'),
    Event           = keystone.list('Event'),
    SMSRetry        = keystone.list('SMSRetry'),
    SMSRetryUnit    = keystone.list('SMSRetryUnit'),
    scheduleRetryService = require('./scheduleRetryService');
    sendSmsService  = require('./sendSMSService');

/**
*
* Item was found. Send sms to user
* then send sms back to finder
*
* @body of the sms received
*/
module.exports = function (body, qrCode) {
    var def = q.defer();

    var serialNumber = qrCode.serialNumber;

    async.waterfall([
        _.partial(registerNewIssue, body, qrCode), // AndItemFoundEvent
        setStateOnQrCode,
        createRetryObject,
        createSMSRetryUnit,
        contactFantnOwner,
        sendThankYouToFinder,
        registerFinderContacted,
    ],function (err) {
        if(err) { return def.reject(err); }

        def.resolve('NORETURN');
    });

    return def.promise;
}



/**
*
* ASYNC#exports#0
*
* Creates Issue and Event(action="Item Found")
*
*/
function registerNewIssue (body, qrCode, next) {
    var message = body.tekst.replace(body.serialNumber, '').trim();

    var issue = new Issue.model({
        serialNumber : qrCode.serialNumber,
        findersGSM : body.gsm,
        findersLand : body.land,
        findersOperator : body.operator,

        // this allways usually empty!
        description : message,
        issueSolved : false,
        userId : qrCode.owner._id,
        ownerMobile : qrCode.owner.mobile,

        // duplicated, just for simplicity
        qrCode : qrCode._id
    });

    var issueId;

    issue.save(function (err, item) {
        body.issueId = item._id;
        logger.log({type:'info', what: 'ISSUE CREATED', serialNumber : item.serialNumber, qrCode : item.qrCode});

        var event = new Event.model({
            action : 'Item found',
            actionText : message,
            issueId : body.issueId,
            qrCode : qrCode._id,
            mobileNumber : body.gsm
        });

        event.save(function(err, e) {
            logger.log({type:'info', what: 'EVENT CREATED', action : e.action, qrCode : e.qrCode});
            next(null, body, qrCode);
        });
    });
}

function setStateOnQrCode (body, qrCode, next) {
    qrCode.selectedStatus = appConstants.qrCodes.FOUND;

    qrCode.save(function (err, res) {
        if (err) {
            logger.log({type:'error', msg : 'Failed to update qr code state ' + err});
        }
        next(null, body, qrCode);
    });
}

function createRetryObject(body, qrCode, next) {

    var smsRetry = new SMSRetry.model({
        qrCode : qrCode._id,
        issueId : body.issueId,
        ownerName : qrCode.owner.name.full
    });

    smsRetry.contact1GSM = qrCode.owner.mobile;
    smsRetry.contact1GSMCtry = qrCode.owner.mobileLand;

    if (qrCode.owner.hasMobile2()) {
        smsRetry.contact2GSM = qrCode.owner.mobile2;
        smsRetry.contact2GSMCtry = qrCode.owner.mobile2Land;
    }
    if (qrCode.owner.hasMobile3()) {
        smsRetry.contact3GSM = qrCode.owner.mobile3;
        smsRetry.contact3GSMCtry = qrCode.owner.mobile3Land;
    }

    smsRetry.save(function(err, smsRetry) {
        if (err) {
            logger.log({type:'error', msg : 'Failed to save SMSRetry ' + err});
        } else {
            logger.log({type:'info', what: 'SMSRETRY CREATED', _id : smsRetry._id });
        }

        body.__smsRetry = smsRetry;
        scheduleRetryService(smsRetry.toJSON());
        next(null, body, qrCode);
    });
}

function createSMSRetryUnit(body, qrCode, next) {
    // loop through all SMSretryunit objects and find the next available id
    // then put the retryunit object on body and use this when sending a message

    // on userConfirm message look for retryunit with this id
    // on retry api, create similar retry unit object and send sms with this
    SMSRetryUnit.model.createUnit({gsm : qrCode.owner.mobile, smsRetryId : body.__smsRetry._id})
    .then(function (result) {

        body.__smsRetryUnit = result;
        next(null, body, qrCode);

    }, function (err) {
        next(null, body, qrCode);
    });
}



/**
*
* ASYNC#exports#1
*
* Sends sms to fantn owner
*/
function contactFantnOwner (body, qrCode, next) {
    async.waterfall([
        sendSMSToOwner.bind(null, body, qrCode),

        registerFantnUserContacted

    ], function (err, body, qrCode) {
        if (err) { logger.log({type:'error', msg : 'Failed contact user ' + err}); }

        next(null, body, qrCode);
    });
}


/**
*
* ASYNC#exports#2
*
* Sends sms thank you to finder
*/
function sendThankYouToFinder (body, qrCode, next) {
    sendSmsService({
        messageId : 2,
        number : body.gsm,
        land : body.land
    })
    .then (function (res) {
        next(null, body, qrCode);
    }, next);
}



/**
*
* ASYNC#exports#3
*
* Creates new Event(action="Finder Contacted")
*/
function registerFinderContacted (body, qrCode, next) {

    var event = new Event.model({
        action : 'Finder Contacted',
        actionText : 'Sent confirmation to finder',
        issueId : body.issueId,
        qrCode : qrCode._id,
        mobileNumber : body.gsm
    });

    event.save(function (e, eventRes) {
        if (e) {logger.log({type:'error', msg : 'Failed to save event ' + e}); }

        logger.log({type:'info', what: 'EVENT CREATED', action : eventRes.action, qrCode : eventRes.qrCode});
        next(null, body, qrCode);
    });
}




/********************************************************************
*                          HELPERS                                  *
*********************************************************************/

/*
* ASYNC#contactFantnUser#0
*
* TODO: if user doesnt answer, try again on different numbers
*
*/
function sendSMSToOwner (body, qrCode, next) {

    sendSmsService({
        messageId : 1,
        number : qrCode.owner.mobile, //used to do body.gsm. that is wrong
        name : qrCode.name,
        land : qrCode.owner.mobileLand,
        qrName : qrCode.name,
        smsRetry : body.__smsRetry,
        smsRetryUnit : body.__smsRetryUnit
    })
    .then (function (result) {
        next(null, result, body, qrCode);
    });
}


/**
*
* ASYNC#contactFantnUser#1
*
*
* Creates new Event(action="Fantn User Contacted")
*/
function registerFantnUserContacted (smsSent, body, qrCode, next) {
    //TODO: handle this
    if (!smsSent) {
        logger.log({type:'error', msg : 'Failed to send message to Eurobates'});
    }


    var event = new Event.model({
        action : 'Fantn User Contacted',
        actionText : 'Sent notification to fantn user',
        issueId : body.issueId,
        qrCode : qrCode._id,
        mobileNumber : qrCode.owner.mobile
    });

    event.save(function (e, eventRes) {
        if (e) { logger.log({type:'error', msg : 'Failed to save event ' + e}); }

        logger.log({type:'info', what: 'EVENT CREATED', action : eventRes.action, qrCode : eventRes.qrCode});
        next(null, body, qrCode);
    });
}
