/** @jsx React.DOM */

var React = require('react/addons');

var BaseModal = React.createClass({

    render : function () {
        return (
            <div className="modal in">
                {this.props.modalBody}
            </div>
        );
    }
});

module.exports = BaseModal;
