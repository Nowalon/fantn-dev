var React = require('react');
var AppStore = require('../stores/AppStore');


function getStateFromStore () {
    return AppStore.get();
}

var ErrorMessages = React.createClass({

    getInitialState () {
        return getStateFromStore();
    },

    componentDidMount () {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount () {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange () {
        this.setState(getStateFromStore);
    },

    render () {
        var view = <div />;
        if ( this.state.errors.length) {
            view = (
                <div class="alert alert-warning">
                    <p>{this.state.errors[0]}</p>
                </div>
            );
        }

        return view;
    }

});

module.exports = ErrorMessages;
