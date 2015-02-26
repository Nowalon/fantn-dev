/** @jsx React.DOM */

var React = require('react');
var ProfileForm = require('./ProfileForm');
var ChangeProfileImg = require('./ChangeProfileImg');

var ProfileStore = require('../../stores/ProfileStore');


function getStateFromStores () {
    return ProfileStore.get();
}


var ProfileLayout = React.createClass({

    getInitialState () {
        return {
            user : getStateFromStores(),
            didHitSubmit : false
        };
    },

    componentDidMount () {
        ProfileStore.addChangeListener(this._onChange);
    },

    componentWillUnmount () {
        ProfileStore.removeChangeListener(this._onChange);
    },

    _onChange () {
        var storeState = getStateFromStores();
        this.setState(storeState);
    },

    __onImgChange (file) {
        var user = this.state.user;
        user.file = file;
        this.setState ({user : user});
    },

    __onSave (e) {
        e.preventDefault();
        // triggers profileform to submit
        this.setState({didHitSubmit : true});
    },

    render () {
        return (
            <div className="profile">
                <h2>Rediger</h2>
                <div className="row">
                    <div className="col-md-7 pal">
                        <ProfileForm user={this.state.user} didHitSubmit={this.state.didHitSubmit}/>
                        <button className="btn btn-success" onClick={this.__onSave}>Lagre</button>
                        <a className="right" href="/forgot-password">Reset Passord</a>

                    </div>
                    <div className="col-md-5 centerify">
                        <ChangeProfileImg onChange={this.__onImgChange} user={this.state.user} />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ProfileLayout;
