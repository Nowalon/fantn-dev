/* global StripeCheckout */
var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
var i18 = require('../../../../../lib/shared/i18');
var loadIcon = require('../utils/load');
var FantnActions = require('../../actions/FantnActions');

var ExecStripePayment = React.createClass({

    mixins: [ReactScriptLoaderMixin],

    getInitialState () {
        return {
            scriptLoading: true,
            scriptLoadError: false,

            // Indicates if the user has clicked on the button before the
            // the script has loaded.
            // hasPendingClick: false,
        };
    },

    statics: {
        stripeHandler: null,
        scriptDidError: false
    },

    getScriptURL () {
        return 'https://checkout.stripe.com/checkout.js';
    },

    setStripeHandler () {
        if (ExecStripePayment.stripeHandler) {return;}

        // Initialize the Stripe handler on the first onScriptLoaded call.
        // This handler is shared by all StripeButtons on the page.
        if (!ExecStripePayment.stripeHandler) {
            ExecStripePayment.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_pHzniKwBmr1Qdcx329RRuTX4',
                image: '/images/fantn_logo_lg.jpg',
                currency: 'NOK',

                token (token) {
                    // Use the token to create the charge with a server-side script.
                    FantnActions.registerPaymentComplete({
                        stripeToken : token.id
                    });
                }
            });
        }
    },

    // ReactScriptLoaderMixin calls this function when the script has loaded
    // successfully.
    onScriptLoaded () {
        this.setState({scriptLoading: false});
        this.setStripeHandler();
    },

    showStripeForm () {
        this.setStripeHandler();
        ExecStripePayment.stripeHandler.open({
            name: 'FANTN',
            description: 'FANTN Abonnement',
            'panel-label' : 'Betal',
            amount: this.props.subscription.subscriptionType.price,
            email : this.props.formData.email
        });
    },

    // ReactScriptLoaderMixin calls this function when the script has failed to load.
    onScriptError () {
        this.setState({scriptLoading: false, scriptLoadError: true});
    },

    render () {
        var view;
        if (this.state.scriptLoading) {
            view = loadIcon();
        } else if (this.state.scriptLoadError) {
            view = <p>{i18.stripeLoadFail.nor}</p>;
        } else {
            view = <div />;
            this.showStripeForm();
        }

        return view;
    }

});

module.exports = ExecStripePayment;
