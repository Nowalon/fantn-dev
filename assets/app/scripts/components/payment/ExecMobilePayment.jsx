/** @jsx React.DOM */

var React = require('react/addons');
var FantnActions = require('../../actions/FantnActions');
var appConstants = require('../../../../../lib/shared/constants');

var MobileMsgModal = React.createClass({

    getInitialState : function () {
        return {done : false, resMessage: ''};
    },

    __onSubmit : function () {
        FantnActions.execMobilePayment();
        // if ( this.state.done) { return this.onExitClick(); }
        // var model = new BaseModel({
        //     subscriptionType : this.props.subType,
        //     url : '/api/payment/chargeMobile'
        // });
        //
        // App.controller.exec(model, 'create', {success : this.onSuccess, fail  : this.onFail});
    },

    // onSuccess : function () {
    //     this.setState({done : true, resMessage : i18.smsInstructions});
    // },

    // onFail : function (err) {
    //     this.setState({done : true, resMessage : 'Noe gikk galt. Kontakt oss eller prøv på nytt senere'});
    // },

    // getSelectedPriceAndMonth : function () {
    //     switch(this.props.subscription.subscriptionType.label) {
    //         case 'one' : return {p: 130, m:12};
    //         case 'two' : return {p: 230, m: 24};
    //         case 'three' : return {p: 300, m: 36};
    //     };
    // },

    render : function () {
        var content;

        if (this.state.done) {
            content = (
                <div>
                    <p>{this.state.resMessage}</p>
                </div>);
        } else {

            var innerContent;
            var price = this.props.subscription.subscriptionType.price / 100;

            if (this.props.subscription.subscriptionType.label === appConstants.subscriptions.MONTH.label) {

                innerContent = (<p><strong>Denne sms-tjenesten koster kun kr {price} i måneden, og fornyes automatisk. Etter at du har logget på for første gang kan du når som helst sende STOPP til 2030 for å unngå fornying</strong></p>);
            } else {
                // var pm = this.getSelectedPriceAndMonth();
                var m = this.props.subscription.subscriptionType.label;

                innerContent = (<p><strong>Du vil med dette betale kr {price} for Fantn medlemskap i {m} måneder. Etter dette må du fornye ditt abonnement.</strong></p>);
            }

            content = (
                <div>
                    <header><h3>Betal Med SMS <img src="/images/mobile.jpg" className="right img-lg img-thumbnail" /></h3></header>
                    <p>SMS betaling er raskt, trygt og effektivt.</p>
                    <p>Du vil motta en SMS fra oss som du må svare på. Deretter er ditt abonnement aktivert </p>
                    <p>{innerContent}</p>
                    <h5>Ditt mobilnummer er: <strong>{this.props.formData.mobile}</strong></h5>
                </div>);
        }

        return (
            <div>
                {content}
                <button className="btn btn-success btn-block" onClick={this.__onSubmit}>OK</button>
                <div className="text-muted">Support: <a ref="mailto:support@fantn.no">support@fantn.no</a></div>
            </div>

        );
    }
});

module.exports = MobileMsgModal;
