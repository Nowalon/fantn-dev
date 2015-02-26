var request = require('superagent');
var FantnActions = require('../actions/FantnActions');

var urls = {
    user : {
        updateUser : id => `/api/users/${id}/updateUser`,
        updateUserPayment : id => `/api/users/${id}/updateUserPayment`,
        registerStripe : id => `/api/users/${id}/payment/chargeStripe`,
        registerPaypal : id => `/api/users/${id}/payment/chargePaypal`,
        registerMobile : id => `/api/users/${id}/payment/chargeMobile`
    },

    qrCode : {
        updateQrItem : (userId, qrId) => `/api/users/${userId}/qrCodes/${qrId}`
    }
};


function execMultipartXhr (url, data, cb) {

    var req = request.put(url)
                .attach('photo_upload', data.file);

    Object.keys(data).forEach((key) => {
        req.field(key, data[key]);
    });

    req.end(cb);
}

function updateUser (data) {
    var url = urls.user.updateUser(data.id);

    if (data.file) {
        return execMultipartXhr(url, data, updateUserSuccess);
    }

    request.post(url)
    .send(data)
    .end(updateUserSuccess);
}

/**
* Update user with subscription and paymentType
*
* @param {object} paymentInfo
*/
function updateUserWithPayment (paymentInfo) {
    var url = urls.user.updateUserPayment(paymentInfo.id);
    request.post(url)
    .send(paymentInfo)
    .end(updateUserWithPaymentSuccess);
}

/**
 * Update user with payment success info and activate the user
 */
function registerStripe (paymentInfo) {
    var url = urls.user.registerStripe(paymentInfo.id);
    request.post(url)
    .send(paymentInfo)
    .end(registerStripeSuccess);
}

function registerPaypal (paymentInfo) {
    var url = urls.user.registerPaypal(paymentInfo.id);
    request.post(url)
    .send(paymentInfo)
    .end(registerPaypalSuccess);
}

function registerMobilePayment (paymentInfo) {
    var url = urls.user.registerMobile(paymentInfo.id);
    request.post(url)
    .send(paymentInfo)
    .end(registerMobilePaymentSuccess);
}

function updateQRItem (formData, userId) {
    var url = urls.qrCode.updateQrItem(userId, formData.id);
    request.put(url)
    .send(formData)
    .end(updateQRItemSuccess);
}



//
// SUCCESS HANDLERS
//

function updateQRItemSuccess(res) {
    if (res.ok) {
        FantnActions.updateQRItemSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }
}

function registerMobilePaymentSuccess (res) {
    if (res.ok) {
        FantnActions.execMobilePaymentSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }
}
function registerStripeSuccess(res) {
    if (res.ok) {
        FantnActions.registerStripeSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }
}


function updateUserSuccess (res) {

    if (res.ok) {
        FantnActions.submitProfileFormSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }
}

/**
* update user with payment returned from server
*
* @param {object} res - contains data from backend
* @returns
*/
function updateUserWithPaymentSuccess (res) {
    if ( res.ok ) {
        FantnActions.finishRegisterFormSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }

}

function registerPaypalSuccess (res) {
    if ( res.ok ) {
        FantnActions.execPaypalCompleteSuccess(res.body);
    }else {
        FantnActions.displayError(res);
    }

}



module.exports = {
    updateUser : updateUser,
    updateUserWithPayment : updateUserWithPayment,
    registerStripe : registerStripe,
    registerPaypal : registerPaypal,
    registerMobilePayment : registerMobilePayment,
    updateQRItem : updateQRItem
};
