'use strict';

var React = require('react'),
    { Route, DefaultRoute } = require('react-router'),
    RegisterWithPayment = require('./components/RegisterWithPayment'),
    RegisterName = require('./components/RegisterName'),
    RegisterSubscription = require('./components/RegisterSubscription'),
    RegisterFinish = require('./components/RegisterFinish');

module.exports = (
    <Route name='register' path='/register' handler={RegisterWithPayment}>
        <Route name="RegisterName" path='/register/RegisterName' handler={RegisterName}/>
        <Route name="RegisterSubscription" path='RegisterSubscription' handler={RegisterSubscription}/>
        <Route name="RegisterFinish" path='/register/registerFinish' handler={RegisterFinish}/>
        <DefaultRoute handler={RegisterName} />
    </Route>

);
