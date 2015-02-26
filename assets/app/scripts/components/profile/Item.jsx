/** @jsx React.DOM */

var React = window.React = require('react');
var appConstants = require('../../../../../lib/shared/constants');
var ItemForm = require('./ItemForm');

var Item = React.createClass({

    getInitialState () {
        return { showResults: false };
    },

    __onEditClick () {
        this.setState({ showResults: !this.state.showResults });
    },

    onFormChange (e) {
        e.preventDefault();
    },

    renderSelectedStatusClass () {
        switch (this.props.data.selectedStatus) {
            case appConstants.qrCodes.AVAILABLE:
                return 'circle-av';
            case appConstants.qrCodes.FOUND:
                return 'circle-found';
            case appConstants.qrCodes.LOST:
                return 'circle-lost';
            default:
                return '';
        }
    },

    render () {
        var show = this.state.showResults;
        var editClass = 'edit ' + (show ? 'show' : '');
        var imageUrl = this.props.data.photo || ('/images/' + this.props.data.image);

    return (
        <li className="row item">
            <div className="col-sm-3">
                <img src={imageUrl} className="img-xs"/>
                <p className="faded">{this.props.data.prefix}-{this.props.data.serialNumber}</p>
            </div>
            <div className="col-sm-5">
                <p>{this.props.data.name}</p>
                <small className="text-muted">{this.props.data.description}</small>
            </div>
            <div className="col-sm-2">
                <div className={'circle ' + this.renderSelectedStatusClass()}></div>
            </div>
            <div className="col-sm-2">
                <button className="btn btn-info" onClick={this.__onEditClick}>Endre</button>
            </div>

            <div className={editClass} id={this.props.data.id + "_edit"}>
                <ItemForm onSubmit={this.props.onSubmit} id={this.props.data.id} data={this.props.data}/>
            </div>
        </li>
    );
    }
});

module.exports = Item;
