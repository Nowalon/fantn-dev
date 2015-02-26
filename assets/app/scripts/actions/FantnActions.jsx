var FantnDispatcher = require('../dispatcher/FantnDispatcher');
var FantnConstants = require('../constants/FantnConstants');
var ActionTypes = FantnConstants.ActionTypes;

var FantnActions = {

    bootstrapUser : (user) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.BOOTSTRAP_USER,
            user: user
        });
    },

    submitProfileForm : (formData) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.SUBMIT_PROFILE_FORM,
            formData: formData
        });
    },

    submitProfileFormSuccess : (res) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.SUBMIT_PROFILE_FORM_SUCCESS,
            res: res
        });
    },

    submitSubscription : (data) => {
        FantnDispatcher.handleViewAction({
            actionType: ActionTypes.SUBMIT_SUBSCRIPTION,
            data: data
        });
    },

    finishRegisterForm : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.FINISH_REGISTER_FORM
        });
    },

    finishRegisterFormSuccess : (res) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.FINISH_REGISTER_FORM_SUCCESS,
            res : res
        });
    },

    execPaypal : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.EXEC_PAYPAL
        });
    },

    // registerStripe
    registerPaymentComplete : (data) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.REGISTER_PAYMENT_COMPLETE,
            data : data
        });
    },

    registerStripeSuccess : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.REGISTER_STRIPE_SUCCESS
        });
    },

    execPaypalCompleteSuccess : (data) => {
        FantnDispatcher.handleViewAction({
            actionType: ActionTypes.EXEC_PAYPAL_SUCCESS,
            data : data
        });
    },

    execMobilePayment : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.EXEC_MOBILE_PAYMENT
        });
    },

    execMobilePaymentSuccess : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.EXEC_MOBILE_PAYMENT_SUCCESS
        });
    },

    readTC : () => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.READ_TC
        });
    },

    displayError : (err) => {
        console.log (`display error ${JSON.stringify(err)}`);
        
        FantnDispatcher.handleViewAction({
            actionType: ActionTypes.DISPLAY_ERROR,
            err: err
        });
    },

    editQRItem : (formData) => {
        FantnDispatcher.handleServerAction({
            actionType: ActionTypes.EDIT_QR_ITEM,
            formData: formData
        });
    },

    updateQRItemSuccess : (res) => {
        FantnDispatcher.handleViewAction({
            actionType: ActionTypes.EDIT_QR_ITEM_SUCCESS,
            res: res
        });
    }
};

module.exports = FantnActions;
