/** @jsx React.DOM */

var React = window.React = require('react');
var Item = require('./Item');

var ItemList = React.createClass({

  render () {
    var itemNodes = this.props.data.map(function (item, index) {
        return (
            <Item data={item} key={index} onSubmit={this.props.onSubmit}/>
        );
    }.bind(this));

    return (
        <ul className="list-unstyled text-left">
            <li className="row">
                <div className="col-sm-3 header">Bilde</div>
                <div className="col-sm-5 header">Tittel</div>
                <div className="col-sm-2 header">Status</div>
                <div className="col-sm-2 header">Handling</div>
            </li>

            {itemNodes}
        </ul>
    );
  }
});

module.exports = ItemList;
