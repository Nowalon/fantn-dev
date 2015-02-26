// /** @jsx React.DOM */
//
// var React = window.React = require('react/addons'),
// ReactCSSTransitionGroup = React.addons.CSSTransitionGroup,
// PaymentForm = require('./PaymentForm');
//
// var PaymentLayout = React.createClass({
//
//     getInitialState: function() {
//         return { paymentType : '' };
//     },
//
//     onMobileClick : function () {
//         this.setState({paymentType : 'mobile'});
//         this.forceUpdate();
//     },
//
//     onCardClick : function () {
//         this.setState({paymentType : 'card'})
//         this.forceUpdate();
//     },
//
//     render: function() {
//
//         var classes = {
//             hide : ''
//         }, form = '';
//
//         if (this.state.paymentType !== '') {
//             classes.hide = 'hide'
//             form = <PaymentForm paymentType={this.state.paymentType} />
//         }
//
//         return (
//             <main id="home" className="body" >
//                 <div className={classes.hide + " banner banner-small"}></div>
//                 <div className={classes.hide + " container"}>
//                     <h1 className="text-center mvs primary">Kom i gang med FantN</h1>
//                     <h4 className="text-center">Velg Betalingsmetode</h4>
//
//                     <div className="row text-center">
//                         <div className="container">
//                             <div className="box">
//                                 <button className="btn btn-block btn-success" onClick={this.onMobileClick}>Mobil</button>
//                                 <p className="text-center">Eller</p>
//                                 <button className="btn btn-block" onClick={this.onCardClick}>Bankkort</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {form}
//             </main>
//         );
//     }
// });
//
// module.exports = PaymentLayout;
