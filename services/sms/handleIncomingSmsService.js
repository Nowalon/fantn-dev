/**
*
* AN SMS JUST CAME IN.
* This module parses the sms and figures out what kind of message it is
*
* delegates to the proper service.
*
*
* Message format:
*
* http://www.fantn.no/api/smsapi?gsm=GSM&operator=OPERATOR&kodeord=KODEORD&tekst=TEKST&kortnr=KORTNR&land=LAND
*
*
* Example Messages:
*
* Item Found:
*
* localhost:5000/api/smsapi?gsm=98628425&operator=47-telenor&kodeord=Fantn&tekst=1000007&kortnr=2030&land=47
*
* User Confirmation:
*
* localhost:5000/api/smsapi?gsm=98628425&operator=47-telenor&kodeord=Fantn&tekst=&kortnr=2030&land=47
*
* Item returned:
*
* localhost:5000/api/smsapi?gsm=98628425&operator=47-telenor&kodeord=Fantn&tekst=1000002&kortnr=2030&land=47
*
*
*
* EXAMPLE ABN:
*
* localhost:5000/api/smsapi?gsm=98628425&operator=47-telenor&kodeord=FANTN12&tekst=&kortnr=2030&land=47
*
*/
var q                           = require('q'),
    _                           = require('lodash'),
    itemFoundSmsService         = require('./itemFoundSmsService'),
    userConfirmationSmsService  = require('./userConfirmationSmsService'),
    itemReturnedSmsService      = require('./itemReturnedSmsService'),
    userConfirmMobilePayment    = require('./userConfirmMobilePayment'),
    logger                      = require('logfmt'),
    keystone                    = require('keystone'),
    Issue                       = keystone.list('Issue'),
    parseSMS                    = require('./parseSMS'),
    assign                      = require('object-assign'),
    appConstants                = require('../../lib/shared/constants'),
    findIssueForQrCode          = require('./findIssueForQRCode'),
    finderRemindsSmsService     = require('./finderRemindsSmsService');


module.exports = function handleIncomingSmsService (body, id) {
    var def = q.defer();
    // Parse the message
    getRequestStatus(body)

    .then(function (result) {
        logger.log({type:'info', what: 'SMS-IN', status: result.__status, gsm : body.gsm, tekst: body.tekst, kodeord : body.kodeord});

        return handleRequest(result);

    })
    .then(function (result) {
        def.resolve(result);

    })
    // something went wrong
    .fail(function(err) {
        logger.log({type:'error', what: 'HANDLE INCOMING SMS', err: JSON.stringify(err)});
        def.reject(err);
    });

    // def.resolve(id);
    return def.promise;
}

// TODO: refactor to use resolve for any valid sms
// reject should ONLY be for invalid messages
function getRequestStatus (body) {
    var def = q.defer();
    parseSMS(body)


    /* QRCODE REQUEST */
    .then(function (res) {

        if (!res) {
            logger.log({type:'error', what: 'PARSE SMS', msg : 'res was null'});
            return def.reject(res);
        }

        if (res.smsType && res.smsType === 'User confirmation') {
            body.__smsRetry = res.smsRetry;
            body.__status = 'User confirmation';
            return def.resolve(body);
        } else {
            return findIssueForQrCode(body, res);
        }
    })

    // next: handleRequest()
    .then(function (result) {

        def.resolve(result);
    })

    /* PAYMENT REQUEST OR USER CONFIRMED */
    .fail(function handlePaymentOrUserConfirm (err, opts) {

        // get Request Is Serial Number returned. next: handleRequest()
        if (err === 'mobile:month') {
            body.__status = 'User start subscription';
            body.__subType = appConstants.subscriptions.MONTH.label;
            body.__amount = '15'; //mer hvis førstegangspris hr høyere
            def.resolve(body);

        } else if (err === 'mobile:one') {
            body.__status = 'User start subscription';
            body.__subType = appConstants.subscriptions.TWELVE.label;
            body.__amount = '130';
            def.resolve(body);

        } else if (err === 'mobile:two') {

            body.__status = 'User start subscription';
            body.__subType = appConstants.subscriptions.TWENTYFOUR.label;
            body.__amount = '230';
            def.resolve(body);

        } else if (err === 'mobile:three') {

            body.__status = 'User start subscription';
            body.__subType = appConstants.subscriptions.THIRTYSIX.label;
            body.__amount = '300';
            def.resolve(body);

        }
        else def.reject(err);
    });

    return def.promise;
};


var handleRequest = function (body) {

    switch(body.__status) {
        case 'Item found' : return itemFoundSmsService(body, body.__qrCode);
        case 'User confirmation' : return userConfirmationSmsService(body);
        case 'Item returned' : return itemReturnedSmsService(body, body.__qrCode, body.__issue);
        case 'Finder reminds' : return finderRemindsSmsService(body, body.__qrCode);
        case 'User start subscription' : return userConfirmMobilePayment(body);

        default :
            // TODO: send filmelding til bruker
            logger.log({type:'error', msg: 'Failed to parse sms message', err: body.__status});
            throw new Error('Failed to parse message');
    }
};
