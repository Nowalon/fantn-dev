var FantnDispatcher = require('../dispatcher/FantnDispatcher');
var FantnConstants = require('../constants/FantnConstants');
var EventEmitter = require('events').EventEmitter;
var _find = require('lodash-node/modern/collections/find');
var assign = require('object-assign');
var assign = require('object-assign');
var api = require('../utils/api.jsx');



var ActionTypes = FantnConstants.ActionTypes;

// events
var CHANGE_EVENT = 'change';

// states
var _items = [];
var _userId;


function editQRItem (formData) {
    api.updateQRItem(formData, _userId);
}

function editQrItemSuccess (res) {
    var newItem = _find(_items, i => {return i.id === res._id;});
    assign(newItem, res, {id : res._id || res.id});
}

var ItemsStore = assign({}, EventEmitter.prototype, {

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
        return _items;
    },

    init (data) {
        _items = data.items;
        _userId = data.userId;
    }
});

ItemsStore.dispatchToken = FantnDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case ActionTypes.EDIT_QR_ITEM :
            editQRItem(action.formData);
            break;

        case ActionTypes.EDIT_QR_ITEM_SUCCESS :
            editQrItemSuccess(action.res);
            ItemsStore.emitChange();
            break;

    default:
        // do nothing
    }

    return true;

});

module.exports = ItemsStore;
