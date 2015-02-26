'use strict';
var FantnDispatcher = require('../dispatcher/FantnDispatcher');
var FantnConstants = require('../constants/FantnConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var api = require('../utils/api.jsx');



var ActionTypes = FantnConstants.ActionTypes;

// events
var CHANGE_EVENT = 'change';
var EXEC_PAYMENT_EVENT = 'exec:payment';
var PROFILE_UPDATED_EVENT = 'profile:updated';

// states
var _formData = {};
var _subscription = {};
var _registrationProcess = {
    profileDone : false,
    subscriptionDone : false,
    paymentDone : false,
    readTC : false
};


function submitSubscription (data) {
    assign(_subscription, data);
    _registrationProcess.subscriptionDone = true;
}

// TODO switch to init
function bootstrapUser (user) {
    _formData = user;
    _formData.id = user.id || user._id;
}

function submitProfileForm (formData) {
    _formData = formData;
    _formData.id = _formData.id;
    api.updateUser(_formData);
}

function submitProfileFormSuccess (res) {
    _formData = res;
    _registrationProcess.profileDone = true;
    RegisterStore.emit(PROFILE_UPDATED_EVENT);
}

function finishRegisterFormSuccess () {
    RegisterStore.emit(EXEC_PAYMENT_EVENT);
}

function execPaypalSuccess (data) {
    location.replace(data.next);
}


/**
* Updates backend with payment information
* on success it will send the user to the proper
* payment form
*/
function finishRegisterForm () {
    api.updateUserWithPayment({
        subscriptionType : _subscription.subscriptionType.label,
        paymentType : _subscription.paymentType,
        id : _formData.id || _formData._id
    });
}


/**
* Sends successfull stripe payment info to the backend
*
* @param paymentData contains things like payment token
*/
function registerStripe (paymentData) {
    api.registerStripe(assign({}, paymentData, {id : _formData.id || _formData._id}));
}


/**
* Makes backend execute payment with paypal
*
* @param
* @returns
*/
function registerPaypal () {
    api.registerPaypal({
        subscriptionType : _subscription.subscriptionType.label,
        paymentType : _subscription.paymentType,
        id : _formData.id || _formData._id
    });
}

function execMobilePayment () {
    api.registerMobilePayment({
        subscriptionType : _subscription.subscriptionType.label,
        paymentType : _subscription.paymentType,
        id : _formData.id || _formData._id
    });
}

function redirectToSlashMe () {
    // redirect to /me
    location.replace('/me');
}


function readTC () {
    _registrationProcess.readTC = true;
}


var RegisterStore = assign({}, EventEmitter.prototype, {

    emitChange () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },


    addExecPaymentListener (callback) {
        this.on(EXEC_PAYMENT_EVENT, callback);
    },

    removeExecPaymentListener (callback) {
        this.removeListener(EXEC_PAYMENT_EVENT, callback);
    },


    addUpdateProfileListener (callback) {
        this.on(PROFILE_UPDATED_EVENT, callback);
    },

    removeUpdateProfileListener (callback) {
        this.removeListener(PROFILE_UPDATED_EVENT, callback);
    },

    get () {
        return {
            formData : _formData,
            subscription : _subscription,
            registrationProcess : _registrationProcess
        };
    },

    init (user) {
        _formData = user;
        _formData.id = user.id || user._id;
    }
});

RegisterStore.dispatchToken = FantnDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {

    case ActionTypes.BOOTSTRAP_USER:
        bootstrapUser (action.user);
        RegisterStore.emitChange();
        break;

    case ActionTypes.SUBMIT_PROFILE_FORM:
        submitProfileForm (action.formData);
        break;

    case ActionTypes.SUBMIT_PROFILE_FORM_SUCCESS:
        submitProfileFormSuccess (action.res);
        break;

    case ActionTypes.SUBMIT_SUBSCRIPTION:
        submitSubscription(action.data);
        break;

    case ActionTypes.FINISH_REGISTER_FORM:
        finishRegisterForm();
        break;

    case ActionTypes.FINISH_REGISTER_FORM_SUCCESS:
        finishRegisterFormSuccess();
        break;

    case ActionTypes.REGISTER_PAYMENT_COMPLETE:
        registerStripe(action.data);
        break;

    case ActionTypes.REGISTER_STRIPE_SUCCESS:
        redirectToSlashMe();
        break;

    case ActionTypes.EXEC_PAYPAL :
        registerPaypal();
        break;

    case ActionTypes.EXEC_PAYPAL_SUCCESS :
        execPaypalSuccess(action.data);
        break;

    case ActionTypes.EXEC_MOBILE_PAYMENT :
        execMobilePayment();
        break;

    case ActionTypes.EXEC_MOBILE_PAYMENT_SUCCESS :
        redirectToSlashMe();
        break;

    case ActionTypes.READ_TC :
        readTC();
        RegisterStore.emitChange();
        break;

    default:
        // do nothing
    }

    return true;

});

module.exports = RegisterStore;
