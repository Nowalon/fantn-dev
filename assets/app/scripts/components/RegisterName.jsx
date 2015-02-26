'use strict';
var React           = require('react'),
    ProfileForm     = require('./profile/ProfileForm'),
    Navigation      = require('react-router').Navigation,
    RegisterStore   = require('../stores/RegisterStore');


function getStateFromStores () {
    var state = RegisterStore.get();
    return {
        formData: state.formData,
        state : state.state
    };
}


var RegisterPayment = React.createClass({

    mixins: [Navigation],

    getInitialState () {
        var state = getStateFromStores();
        state.didHitSubmit = false;
        return state;
    },

    componentDidMount () {
        RegisterStore.addChangeListener(this._onChange);
        RegisterStore.addUpdateProfileListener(this._onUpdateProfileChange);
    },

    componentWillUnmount () {
        RegisterStore.removeChangeListener(this._onChange);
        RegisterStore.removeUpdateProfileListener(this._onUpdateProfileChange);
    },

    __nextClicked (e) {
        e.preventDefault();

        // triggers profileform to submit
        this.setState({didHitSubmit : true});
    },

    _onChange () {
        var storeState = getStateFromStores();
        this.setState(storeState);
    },

    _onUpdateProfileChange () {
        this.transitionTo('RegisterSubscription');
    },

    render () {
        return (
            <div>
                <ProfileForm user={this.state.formData} didHitSubmit={this.state.didHitSubmit} />
                <div className="row text-right">
                    <a id="register-name-next" href="/register/RegisterSubscription"
                        onClick={this.__nextClicked}
                        className="btn btn-success">Neste</a>
                </div>
            </div>
        );
    }
});

module.exports = RegisterPayment;
