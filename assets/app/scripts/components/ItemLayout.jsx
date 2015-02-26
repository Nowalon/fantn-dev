/** @jsx React.DOM */

var React       = window.React = require('react'),
    ItemList    = require('./profile/ItemList'),
    assign = require('object-assign');
    // BaseModel   = require('../models/BaseModel');

var PaymentStore = require('../stores/PaymentsStore');
var ProfileStore = require('../stores/ProfileStore');
var ItemStore = require('../stores/ItemsStore');



function getStateFromStores () {
    return assign ({}, {
        items : ItemStore.get(),
        user : ProfileStore.get()
    }, PaymentStore.get());

}



var ItemLayout = React.createClass({

    getInitialState () {
        return getStateFromStores();
    },

    componentDidMount () {
        ItemStore.addChangeListener(this._onChange);
    },

    componentWillUnmount () {
        ItemStore.removeChangeListener(this._onChange);
    },

    _onChange () {
        this.setState(getStateFromStores());
    },

    renderItemView () {
        return <ItemList data={this.state.items} />;
    },

    renderEmptyView () {
        var mobilePayment = this.state.user.paymentType === 'mobile';

        if (mobilePayment) {
            return (
                <div>
                    <h4 className="mtl">Vi venter på din SMS som bekrefter ditt abonnement.</h4>
                    <p>Ikke mottatt SMS fra oss? <a href="/register/registerName">Gjennomfør registreringen på nytt for å motta ny invitasjon.</a></p>
                </div>
            );
        } else {
            return (
                <div>
                    <h4 className="mtl">Det ser ikke ut til at du har gjennomført noe betaling enda</h4>
                    <a href="/register/registerName" className="btn btn-success mtm">Utfør Betaling</a>
                </div>
            );
        }
    },

    render () {

        var view = this.state.transactions.length ?
            this.renderItemView() : this.renderEmptyView();

        return (
            <div className="qr-listing profile">
                <header><h2>Mine Gjenstander</h2></header>
                {view}
            </div>
        );
    }
});

module.exports = ItemLayout;
