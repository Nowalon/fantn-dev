"use strict";
/*

Create a billing plan, activate it and use it to create a billing Agreement.

*/
var url         = require('url'),
    q           = require('q'),
    keystone    = require('keystone'),
    moment      = require('moment'),
    logger 		= require('logfmt'),
    utils       = require('../../../lib/routeUtils');


module.exports = function (paypal) {
    var def = q.defer();

    // Create the billing plan
    paypal.billingPlan.create(billingPlanAttributes(), function (err, billingPlan) {
        if (err) {
            return rejectWithError(def, error, 'Paypal create plan error');
        } else {

            // Activate the plan by changing status to Active
            return paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (err2, response) {

                if (err2) {
                    return rejectWithError(def, err2, 'Paypal activate plan error');

                } else {

                    billingAgreementAttributes.plan.id = billingPlan.id;
                    billingAgreementAttributes["start_date"] = moment().add(1, 'month').format('YYYY-MM-DDTHH:mm:ss') + 'Z';


                    // Use activated billing plan to create agreement
                    return paypal.billingAgreement.create(billingAgreementAttributes, function (err3, billingAgreement) {

                        if (err3) {
                            return rejectWithError(def, err3, 'Paypal create agreemenet error');
                        } else {

                            for (var index = 0; index < billingAgreement.links.length; index++) {

                                if (billingAgreement.links[index].rel === 'approval_url') {
                                    var approval_url = billingAgreement.links[index].href;
                                    var token = url.parse(approval_url, true).query.token;
                                    logger.log({type:'debug', msg: 'Paypal plan created: ' + token});

                                    def.resolve({
                                        paymentToken : token,
                                        redirectUrl : approval_url
                                    });
                                }
                            }
                        }
                    });
                }
            });
        }
    });
    return def.promise;
}

function billingPlanAttributes() {

    return {
        "name": "FANTN recurring payment",
        "description": "FANTN månedlig abonnement",
        "type": "fixed",
        "payment_definitions": [
        {
            "name": "Regular Payments",
            "type": "REGULAR",
            "frequency": "MONTH",
            "frequency_interval": "1",
            "amount": {
                "value": "15",
                "currency": "NOK"
            },
            "cycles": "12",
            "charge_models": [
            {
                "type": "TAX",
                "amount": {
                    "value": "15",
                    "currency": "NOK"
                }
            }
            ]
        }
        ],
        "merchant_preferences": {
            "setup_fee": {
                "value": "17",
                "currency": "NOK"
            },
            "return_url": utils.getUrl() + 'api/payment/paypal/recurring/execute',
            "cancel_url": utils.getUrl() + 'api/payment/paypal/recurring/cancel',
            "auto_bill_amount": "YES",
            "initial_fail_amount_action": "CONTINUE",
            "max_fail_attempts": "1"
        }
    };
};

var billingPlanUpdateAttributes = [
{
    "op": "replace",
    "path": "/",
    "value": {
        "state": "ACTIVE"
    }
}
];

var billingAgreementAttributes = {
    "name": "FANTN Recurring Agreement",
    "description": "FANTN månedlig abonnement",
    "plan": {
        "id": "" // this is set above
    },
    "payer": {
        "payment_method": "paypal"
    }
};

function rejectWithError(def, error, msg) {
    logger.log({
        type: 'error',
        msg: msg,
        error: JSON.stringify(error)
    });

    return def.reject(error);
}
