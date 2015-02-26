'use strict';
var React = require('react');
var RegisterStore = require('../stores/RegisterStore');
var FantnActions = require('../actions/FantnActions');
var Navigation  = require('react-router').Navigation;
var appConstants = require('../../../../lib/shared/constants');
var ExecMobilePayment = require('./payment/ExecMobilePayment');
var assign = require('object-assign');
var i18 = require('../../../../lib/shared/i18');
var loadIcon = require('./utils/load');
var ExecStripePayment = require('./payment/ExecStripePayment');

function getStateFromStores() {
    return RegisterStore.get();
}


var RegisterPayment = React.createClass({

    mixins: [Navigation],

    getInitialState () {
        return assign({}, getStateFromStores(), {
            execPaymentComponent : undefined,
        });
    },

    componentDidMount () {
        if (!this.state.registrationProcess.subscriptionDone) {
            return this.transitionTo('RegisterName');
        }
        RegisterStore.addChangeListener(this._onChange);
        RegisterStore.addExecPaymentListener(this._execPayment);
    },

    componentWillUnmount () {
        RegisterStore.removeChangeListener(this._onChange);
        RegisterStore.removeExecPaymentListener(this._execPayment);
    },

    __tcClicked () {
        FantnActions.readTC();
    },

    __prevClicked (e) {
        e.preventDefault();
        this.transitionTo('RegisterSubscription');
    },

    /**
    * forces the component to render with payment deets
    */
    _execPayment () {
        this.setState({
            execPaymentComponent : this.state.subscription.paymentType
        });
    },


    sendToStripe () {
        return <ExecStripePayment formData={this.state.formData} subscription={this.state.subscription}/>;
    },

    sendToPaypal () {
        setTimeout(FantnActions.execPaypal, 10);
        var icon = loadIcon();
        return (
            <div>
                <h4 className="mvm">{i18.sentToPaypalMsg}</h4>
                {icon}
            </div>
        );
    },

    sendToMobilePayment () {
        return <ExecMobilePayment formData={this.state.formData} subscription={this.state.subscription} />;
    },


    __onSubmit (e) {
        e.preventDefault();
        FantnActions.finishRegisterForm();
    },

    renderSubscriptionLabel () {
        if (!this.state.subscription.subscriptionType) { return ''; }

        return appConstants.getPrintableLabel(this.state.subscription.subscriptionType.label);

    },

    renderExecPaymentView () {
        switch(this.state.subscription.paymentType) {

            case appConstants.paymentTypes.STRIPE :
                return (
                    <div>
                        {this.sendToStripe()}
                        {this.renderNormalView()}
                    </div>
                );

            case appConstants.paymentTypes.PAYPAL :
                return this.sendToPaypal();

            case appConstants.paymentTypes.MOBILE :
                return this.sendToMobilePayment();

            default :
                return '';
        }
    },

    renderNormalView () {
        var disabled = this.state.registrationProcess.readTC;

        return (
            <div>
                <h4>Oppsummering</h4>
                <div className="row">
                    <div className="col-sm-6">
                        <p>Navn</p>
                        <p>Epost</p>
                        <p>Adresse</p>
                        <p>Telefon</p>
                        <br />
                        <p>Abonnement</p>
                        <p>Betalingsmåte</p>
                    </div>
                    <div className="col-sm-6">
                        <p className="bold">{this.state.formData.name}</p>
                        <p className="bold">{this.state.formData.email}</p>
                        <p className="bold">{this.state.formData.adress}</p>
                        <p className="bold">{this.state.formData.mobileLand} {this.state.formData.mobile}</p>
                        <br />
                        <p className="bold" id="reg-fin-sub">{this.renderSubscriptionLabel()}</p>
                        <p className="cap bold" id="reg-fin-type">{this.renderPaymentTypeLabel()}</p>
                    </div>
                </div>

                <div className="row mvl">
                    <input type="checkbox" onClick={this.__tcClicked} checked={disabled} />
                    <a href="/docs/TermsandConditions.pdf" className="mls" target="_blank">{i18.tc.nor}</a>
                </div>

                <div className="clearfix">
                    <button className="btn btn-success right" disabled={!disabled} onClick={this.__onSubmit}>Bekreft og betal</button>

                    <a id="reg-sub-next" href="/register/#RegisterSubscription"
                        onClick={this.__prevClicked}
                    className="btn btn-info left">Forrige</a>
                </div>
            </div>
        );
    },

    renderPaymentTypeLabel () {
        if (this.state.subscription.paymentType === appConstants.paymentTypes.MOBILE) {
            return i18.mobilePayment.nor;
        } else {
            return this.state.subscription.paymentType;
        }
    },

    render () {
        var view = '';

        // if stripe
        //  show the same view but with stripe over
        // if mobile
        //  change the view
        // if paypal
        //  redirect to paypal
        if (this.state.execPaymentComponent) {
            view = this.renderExecPaymentView();
        } else {
            view = this.renderNormalView();
        }

        return view;
    },

    /**
    * Event handler for 'change' events coming from the RegisterStore
    */
    _onChange () {
        this.setState(getStateFromStores());
    }
});

module.exports = RegisterPayment;
