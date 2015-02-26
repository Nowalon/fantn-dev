var keyMirror = require('keymirror');


module.exports = {

    ActionTypes: keyMirror({
        BOOTSTRAP_USER: null,
        SUBMIT_PROFILE_FORM: null,
        SUBMIT_PROFILE_FORM_SUCCESS : null,
        SUBMIT_SUBSCRIPTION : null,
        FINISH_REGISTER_FORM : null,
        FINISH_REGISTER_FORM_SUCCESS : null,
        REGISTER_PAYMENT_COMPLETE : null,
        REGISTER_STRIPE_SUCCESS : null,
        EXEC_PAYPAL : null,
        EXEC_PAYPAL_SUCCESS : null,
        EXEC_MOBILE_PAYMENT : null,
        EXEC_MOBILE_PAYMENT_SUCCESS : null,
        READ_TC : null,
        DISPLAY_ERROR : null,
        EDIT_QR_ITEM : null,
        EDIT_QR_ITEM_SUCCESS : null
    }),

    PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
    })

};
