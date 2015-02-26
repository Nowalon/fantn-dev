/* global __bootstrap */
/** @jsx React.DOM */

// https://dribbble.com/shots/1568775-Dashboard/attachments/240975
// https://dribbble.com/shots/1499711-Dashboard?list=searches&tag=dashboard&offset=408
// https://dribbble.com/shots/1445036-Software-Dashboard?list=searches&tag=dashboard&offset=398


// React.initializeTouchEvents(true)

var App = {};
global.App = App;

var React           = require('react');
var router          = require('./profileRouter');
var ErrorMessages = require('./components/ErrorMessages');

window.React = React; // export for http://fb.me/react-devtools


    // Sidenav         = require('./components/Sidenav'),
    // ItemLayout      = require('./components/ItemLayout'),
    // ProfileLayout   = require('./components/profile/ProfileLayout'),
    // PaymentLayout   = require('./components/payment/PaymentLayout'),
    // AppController   = require('./AppController'),
    // Radio           = require('radio'),

var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

var ItemsStore      = require('./stores/ItemsStore');
var PaymentsStore   = require('./stores/PaymentsStore');
var ProfileStore    = require('./stores/ProfileStore');

// user for submiting profile update
var RegisterStore    = require('./stores/RegisterStore');
RegisterStore.init(initialState);


ItemsStore.init({
    items:__bootstrap.qrCodes,
    userId : initialState.id || initialState._id
});

PaymentsStore.init(initialState.transactions);
ProfileStore.init(initialState);

router.run((Handler, state) => {
    React.render(<Handler {...state} />, document.getElementById('app-start'));
});


React.render(<ErrorMessages />, document.getElementById('flash-app-root'));




//
// var mountNode = document.getElementById('app-start');
//
//
// var Root = React.createClass({
//
//     getInitialState : function () {
//         return {route : 'items'};
//     },
//
//     componentWillMount : function () {
//         App.radio('nav:change').subscribe(this.onNavChange);
//     },
//
//     onNavChange : function (nav) {
//         this.setState({route : nav});
//     },
//
//     // inside
//     render: function () {
//         var url = window.location.pathname;
//
//         if (url === '/payment') {
//             return (<PaymentLayout />);
//
//         } else {
//
//             var layout;
//
//             if ( this.state.route === 'items') {
//                 layout = <ItemLayout />
//             } else if(this.state.route === 'profile') {
//                 layout = <ProfileLayout />
//             }
//
//             return (
//                 <div className="row body">
//                     <Sidenav />
//                     <div id="content" className="col-sm-10">
//                         {layout}
//                     </div>
//                 </div>
//             );
//         }
//     }
// });
//
//
// App.init = function () {
//     this.user = window.__bootstrap.user;
//     this.controller = new AppController(this);
//     this.radio = Radio;
//
//
//     React.renderComponent(<Root />, mountNode);
//
//     this.controller.init();
//
//     this.getUserId = function () {
//         return this.user.id;
//     }
// }
//
// App.init();
