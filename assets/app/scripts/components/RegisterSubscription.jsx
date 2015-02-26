var React = require('react');
var Navigation  = require('react-router').Navigation;
var constants = require('../../../../lib/shared/constants');
var FantnActions = require('../actions/FantnActions');
var RegisterStore = require('../stores/RegisterStore');
var i18 = require('../../../../lib/shared/i18');

function getStateFromStore () {
    return RegisterStore.get();
}

var RegisterSubscription = React.createClass({

    mixins: [Navigation],

    getInitialState () {
        var storeState = getStateFromStore();

        return {
            subscriptionType : storeState.subscription.subscriptionType || '',
            paymentType : storeState.subscription.paymentType || '',
            errorMsg : '',
            registrationProcess : storeState.registrationProcess
        };
    },

    componentDidMount () {
        if (!this.state.registrationProcess.profileDone) {
            this.transitionTo('RegisterName');
        }
    },

    __onSubscriptionClick (subscriptionType) {
        this.setState({subscriptionType : subscriptionType});
    },

    __onPaymentTypeClick (type) {
        this.setState({paymentType : type});
    },

    __nextClicked (e) {
        e.preventDefault();
        if ( this.state.subscriptionType && this.state.paymentType ) {

            FantnActions.submitSubscription({
                subscriptionType : this.state.subscriptionType,
                paymentType : this.state.paymentType
            });

            this.transitionTo('RegisterFinish');
        } else {
            // show error
            this.setState({errorMsg : 'Du må velge abonnement og betalingstype'});
        }
    },

    __prevClicked (e) {
        e.preventDefault();
        this.transitionTo('RegisterFinish');
    },

    render () {
        var error = this.state.errorMsg ?
            <p className='error mvm text-center error'>{this.state.errorMsg}</p> : '';

        var s = this.state.subscriptionType.label;
        var p = this.state.paymentType;
        var classes = {
            error : this.state.errorMsg ? 'error' : '',
            month : s===constants.subscriptions.MONTH.label ? 'active' : '',
            twelve : s===constants.subscriptions.TWELVE.label ? 'active' : '',
            twentyfour : s===constants.subscriptions.TWENTYFOUR.label ? 'active' : '',
            thirtysix : s===constants.subscriptions.THIRTYSIX.label ? 'active' : '',
            paypal : p===constants.paymentTypes.PAYPAL ? 'active' : '',
            stripe : p===constants.paymentTypes.STRIPE ? 'active' : '',
            mobile : p===constants.paymentTypes.MOBILE ? 'active' : ''
        };

        return (
            <div id="register-subscription">
                <div className="row">

                    {error}

                    <div className="col-xs-6">
                        <h4>1. Velg Abonnement </h4>

                        <div><button id="reg-sub-12" className={"btn btn-success modal-btn " + classes.twelve} onClick={this.__onSubscriptionClick.bind(this, constants.subscriptions.TWELVE)}>
                            12 Måneder
                            <small className="small mlxs">130,-</small>
                        </button></div>

                        <div><button className={"btn btn-success modal-btn " + classes.twentyfour} onClick={this.__onSubscriptionClick.bind(this, constants.subscriptions.TWENTYFOUR)}>
                            24 Måneder
                            <small className="small mlxs">230,-</small>
                        </button></div>

                        <div><button className={"btn btn-success modal-btn " + classes.thirtysix} onClick={this.__onSubscriptionClick.bind(this, constants.subscriptions.THIRTYSIX)}>
                            36 Måneder
                            <small className="small mlxs">300,-</small>
                        </button></div>

                        <div><button className={"btn btn-success modal-btn " + classes.month} onClick={this.__onSubscriptionClick.bind(this, constants.subscriptions.MONTH)}>
                            Månedlig
                            <p className="small">12,- pr måned + 17,- i innmelding</p>
                        </button></div>
                    </div>
                    <div className="col-xs-6">
                        <h4>2. Velg Betalingstype </h4>

                        <div><button id="reg-sub-paypal" className={"btn modal-btn btn-warning " + classes.paypal} onClick={this.__onPaymentTypeClick.bind(this, constants.paymentTypes.PAYPAL)}>
                            <img className="payment-icon" src="/images/paypal.png" />
                            Paypal
                        </button></div>
                        <div><button className={"btn modal-btn btn-warning " + classes.stripe} onClick={this.__onPaymentTypeClick.bind(this, constants.paymentTypes.STRIPE)}>
                            <img className="payment-icon" src="/images/stripe.png" />
                            Stripe
                        </button></div>
                        <div><button className={"btn modal-btn btn-warning " + classes.mobile} onClick={this.__onPaymentTypeClick.bind(this, constants.paymentTypes.MOBILE)}>
                            <i className="icon i-2x ion-iphone payment-icon"></i>
                            {i18.mobilePayment}
                        </button></div>
                    </div>
                </div>

                <div className="mvs dark-pad">
                    <div className="row">
                        <div className="col-xs-6">
                            <em className="lead small">{i18.paymentInfo.nor}</em>
                        </div>
                        <div className="col-xs-6">
                            <img src="/images/mobile.jpg" className="w-8" />
                        </div>
                    </div>
                </div>

                <div className="row text-right">
                    <a id="reg-sub-next" href="/register/#RegisterName"
                        onClick={this.__prevClicked}
                    className="btn btn-info left">Forrige</a>

                    <a id="reg-sub-next" href="/register/#RegisterWithPayment"
                        onClick={this.__nextClicked}
                        className="btn btn-success">Neste</a>
                </div>
            </div>
        );
    }

});

module.exports = RegisterSubscription;
