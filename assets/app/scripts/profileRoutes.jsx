'use strict';

var React = require('react'),
    { Route, DefaultRoute, NotFoundRoute } = require('react-router'),
    MeView = require('./components/MeView'),
    ItemsView = require('./components/ItemLayout'),
    ProfileView = require('./components/profile/ProfileLayout'),
    PaymentsView = require('./components/payment/PaymentsView');


module.exports = (
    <Route name='meView' path='/me' handler={MeView}>
        <Route name="ItemsView" path='/me/items' handler={ItemsView}/>
        <Route name="ProfileView" path='/me/profile' handler={ProfileView}/>
        <Route name="PaymentsView" path='/me/payments' handler={PaymentsView}/>
        <DefaultRoute handler={ItemsView} />
        <NotFoundRoute handler={ItemsView} />
    </Route>
);
