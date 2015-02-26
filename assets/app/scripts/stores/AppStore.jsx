var FantnDispatcher = require('../dispatcher/FantnDispatcher');
var FantnConstants = require('../constants/FantnConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');



var ActionTypes = FantnConstants.ActionTypes;

// events
var CHANGE_EVENT = 'change';

var _state = {
    errors : []
};

function displayError (err) {
    _state.errors = err;
}

var AppStore = assign({}, EventEmitter.prototype, {

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
        return _state;
    },

});

AppStore.dispatchToken = FantnDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {

        case ActionTypes.DISPLAY_ERROR:
            displayError(action.err);
            AppStore.emitChange();
            break;

    default:
        // do nothing
    }

    return true;

});

module.exports = AppStore;
