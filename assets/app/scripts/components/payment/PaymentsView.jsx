var React = require('react');
var PaymentsStore = require('../../stores/PaymentsStore');
var appConstants = require('../../../../../lib/shared/constants');

function getStateFromStores() {
    return PaymentsStore.get();
}

var PaymentsView = React.createClass({

    getInitialState () {
        return getStateFromStores();
    },

    renderSubscriptionType (type) {
        return appConstants.getPrintableLabel(type);
    },

    renderTransactions () {
        return this.state.transactions.map((tr, i) => {
            return (<div className="row" key={`transaction-${i}`}>
                <div className="col-xs-4"><p>{tr.amount},-</p></div>
                <div className="col-xs-4"><p>{this.renderSubscriptionType(tr.subscriptionType)}</p></div>
                <div className="col-xs-4"><p>{tr.createdAt}</p></div>
            </div>);
        });
    },

    render () {
        var transactions = this.renderTransactions();
        return (
            <div>
                <header><h2>Mine Transaksjoner</h2></header>
                <main className="container "></main>
                <div className="row fat mvm">
                    <div className="col-xs-4"><p>Betalt kr</p></div>
                    <div className="col-xs-4"><p>FANTN abonnement</p></div>
                    <div className="col-xs-4"><p>Dato betalt</p></div>
                </div>
                {transactions}
            </div>
        );
    }

});

module.exports = PaymentsView;
