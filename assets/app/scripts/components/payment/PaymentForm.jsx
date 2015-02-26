// /** @jsx React.DOM */
//
// var React = window.React = require('react/addons');
// var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
// var BaseModel = require('../../models/BaseModel');
// var MobileMsgModal = require('./MobileMsgModal');
// var ProfileForm = require('../profile/ProfileForm');
// var transform = require('lodash').transform;
// var reqwest = require('reqwest');
//
// var PaymentForm = React.createClass({
//
//     mixins: [ReactScriptLoaderMixin],
//
//     getInitialState : function () {
//         return {
//             readTC : false,
//             subscriptionType : 'one',
//             user : __bootstrap.user,
//             service : 'paypal'
//         };
//     },
//
//     __tcClicked : function () {
//         this.setState({readTC : true});
//     },
//
//     __subscriptionClicked : function (e) {
//         e.preventDefault();
//         this.setState({subscriptionType : e.currentTarget.value});
//     },
//
//     __serviceSelected : function (e) {
//         e.preventDefault();
//         this.setState({service : e.currentTarget.value});
//     },
//
//     getScriptURL: function() {
//         return 'https://checkout.stripe.com/checkout.js';
//     },
//
//     statics: {
//         stripeHandler: null,
//         scriptDidError: false,
//     },
//
//     // Indicates if the user has clicked on the button before the
//     // the script has loaded.
//     hasPendingClick: false,
//
//     onScriptLoaded: function() {
//         var that = this;
//
//         // Initialize the Stripe handler on the first onScriptLoaded call.
//         // This handler is shared by all StripeButtons on the page.
//         if (!PaymentForm.stripeHandler) {
//             PaymentForm.stripeHandler = StripeCheckout.configure({
//                 key: 'pk_test_pHzniKwBmr1Qdcx329RRuTX4',
//                 image: '/dist/images/fantn_logo_lg.jpg',
//                 currency: 'NOK',
//
//                 token: function(token) {
//                         // Use the token to create the charge with a server-side script.
//                         reqwest({
//                             url : '/api/payment/charge',
//                             method : 'post',
//                             data : {
//                                 stripeToken : token.id,
//                                 subscriptionType : that.state.subscriptionType
//                             }
//                         })
//                         .then(function(res) {
//                             console.log('success: ' + res);
//                             alert('Takk, du er nå registrert. Du vil motta ditt sett med FANTN merker i posten om få dager');
//                             location.replace('/me');
//                         })
//                         .fail(function(err) {
//                             console.log('err: ' + err);
//                             alert('Noe gikk galt! Prøv igjen senere');
//                         });
//                 }
//             });
//
//             if (this.hasPendingClick) {
//                 this.showStripeDialog();
//             }
//         }
//     },
//
//     showLoadingDialog: function() {
//         // show a loading dialog
//     },
//
//     hideLoadingDialog: function() {
//         // hide the loading dialog
//     },
//
//     showStripeDialog: function() {
//         this.hideLoadingDialog();
//         PaymentForm.stripeHandler.open({
//                 name: 'FANTN',
//                 description: i18.subscriptionDesc.nor,
//                 'panel-label' : 'Betal',
//                 amount: 20000,
//                 email : window.App.user.email
//             });
//     },
//
//     onScriptError: function() {
//         this.hideLoadingDialog();
//         PaymentForm.scriptDidError = true;
//     },
//
//     sendToStripe : function (model) {
//         if (PaymentForm.scriptDidError) {
//             console.log('failed to load script');
//         } else if (PaymentForm.stripeHandler) {
//             this.showStripeDialog();
//         } else {
//             this.showLoadingDialog();
//             this.hasPendingClick = true;
//         }
//     },
//
//     registerForm : function (next) {
//         var form = this.state.user;
//
//         form.url = '/api/users/' + App.getUserId() + '/updateUser';
//
//         var model = new BaseModel(form);
//         App.controller.exec(model, 'create', {success: next});
//     },
//
//     sendToPaypal : function () {
//         var model = new BaseModel({
//             subscriptionType : this.state.subscriptionType,
//             url : '/api/payment/paypal'
//         });
//
//         App.controller.exec(model, 'create', {success : function (result) {
//             location.replace(result.next);
//         }});
//     },
//
//     showMobilePaymentMessage : function () {
//         var c = <MobileMsgModal user={this.state.user} subType={this.state.subscriptionType} />
//
//         App.radio('modal:open').broadcast(c);
//     },
//
//     onSubmit: function(e) {
//         e.preventDefault();
//         var nextFn;
//
//         if (this.props.paymentType === 'mobile') {
//             nextFn = this.showMobilePaymentMessage;
//
//         } else if ( this.state.service === 'paypal') {
//             nextFn = this.sendToPaypal;
//
//         // stripe
//         } else {
//             nextFn = this.sendToStripe;
//         }
//
//         this.registerForm(nextFn);
//     },
//
//     __onChange : function (e) {
//         var ct = e.currentTarget;
//         var field = ct.id;
//         var data = ct.value;
//         this.state.user[field] = data;
//         this.setState({user : this.state.user});
//     },
//
//     render: function() {
//
//         var disabled = this.state.readTC ? false : 'disabled';
//         var classes = {
//             oneBtn : this.state.subscriptionType === "one" ? "btn-success" : "btn-original",
//             twoBtn : this.state.subscriptionType === "two" ? "btn-success" : "btn-original",
//             threeBtn : this.state.subscriptionType === "three" ? "btn-success" : "btn-original",
//             monthBtn : this.state.subscriptionType === "month" ? "btn-success" : "btn-original",
//             paypalBtn : this.state.service === "paypal" ? "btn-success" : "btn-original",
//             stripeBtn : this.state.service === "stripe" ? "btn-success" : "btn-original"
//         };
//
//         var selectServiceTpl = this.props.paymentType === 'mobile' ? '' : (
//             <div className="row">
//                 <p>Velg Betalingsform</p>
//                 <button className={"col-sm-6 btn " + classes.paypalBtn} onClick={this.__serviceSelected} value="paypal">Paypal</button>
//                 <button className={"col-sm-6 btn " + classes.stripeBtn} onClick={this.__serviceSelected} value="stripe">Stripe</button>
//             </div>
//         );
//
//         return (
//                 <div className="container">
//                     <form>
//                         <div className="row pal">
//                             <div className="col-sm-8">
//                                 <ProfileForm onChange={this.__onChange} user={this.state.user} />
//                                 <div className="form-group mvm">
//                                     <div className="row pas">
//                                         <input type="checkbox" onClick={this.__tcClicked} />
//                                         <a href="/docs/TermsandConditions.pdf" target="_blank">Jeg har lest og forstått vilkårene for kjøp</a>
//                                     </div>
//                                     <input type="submit" value="Registrer" className="btn btn-success" disabled={disabled} onClick={this.onSubmit} />
//                                 </div>
//
//                             </div>
//
//                             <div className="col-sm-4">
//                                 <div className="box">
//                                     <p className="lead">Velg abonnement</p>
//
//                                     <p className="mvm"><em className="lead small">FantN er et abonnements system hvor du kan betale månedlig, eller for 12, 24 eller 36 måneder. Betaling gjøres over nettet via bankkort eller via mobiltelefon abonnement.
//                                     All betaling foretas via vår serviceprovider Stripe og sikker betaling.</em></p>
//                                     <div className="row">
//                                         <div className="mvs">
//                                             <button className={"btn btn-block " + classes.oneBtn} onClick={this.__subscriptionClicked} value="one">12 Måneder: 130,-</button>
//                                         </div>
//
//                                         <div className="mvs">
//                                             <button className={"btn btn-block " + classes.twoBtn} onClick={this.__subscriptionClicked} value="two">24 Måneder: 230,-</button>
//                                         </div>
//
//                                         <div className="mvs">
//                                             <button className={"btn btn-block " + classes.threeBtn} onClick={this.__subscriptionClicked} value="three">36 Måneder: 300,-</button>
//                                         </div>
//
//                                         <div className="mvs">
//                                             <button className={"btn btn-block " + classes.monthBtn} onClick={this.__subscriptionClicked} value="month"><div>Månedlig, 12,- pr måned</div><small>(+ 17,- kr i innmeldingsavgift)</small></button>
//                                         </div>
//                                     </div>
//                                     {selectServiceTpl}
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//         );
//     }
// });
//
// module.exports = PaymentForm;
