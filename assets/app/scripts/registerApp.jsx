'use strict';

var React       = require('react'),
    router      = require('./router'),
    ErrorMessages = require('./components/ErrorMessages'),
    FantnActions = require('./actions/FantnActions');


window.React = React; // export for http://fb.me/react-devtools


var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);
FantnActions.bootstrapUser(initialState.user);


router.run((Handler, state) => {
    React.render(<Handler {...state} />, document.getElementById('app-start'));
});

React.render(<ErrorMessages />, document.getElementById('flash-app-root'));
