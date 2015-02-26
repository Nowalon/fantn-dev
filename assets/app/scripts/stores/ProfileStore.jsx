var FantnDispatcher = require('../dispatcher/FantnDispatcher');
var FantnConstants = require('../constants/FantnConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var api = require('../utils/api.jsx');



var ActionTypes = FantnConstants.ActionTypes;

// events
var CHANGE_EVENT = 'change';

// states
var _user = [];


var ProfileStore = assign({}, EventEmitter.prototype, {

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
        return _user;
    },

    init (user) {
        _user = user;
    }
});


ProfileStore.dispatchToken = FantnDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {


    default:
        // do nothing
    }

    return true;

});

module.exports = ProfileStore;
