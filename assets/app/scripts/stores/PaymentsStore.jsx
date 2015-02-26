var FantnDispatcher = require('../dispatcher/FantnDispatcher');
// var FantnConstants = require('../constants/FantnConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');



// var ActionTypes = FantnConstants.ActionTypes;

// events
var CHANGE_EVENT = 'change';

// states
var _transactions = [];


var PaymentsStore = assign({}, EventEmitter.prototype, {

    emitChange () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get () {
        return {transactions : _transactions};
    },

    init (transactions) {
        _transactions = transactions;
    }
});

PaymentsStore.dispatchToken = FantnDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {


    default:
        // do nothing
    }

    return true;

});

module.exports = PaymentsStore;
