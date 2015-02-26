'use strict';
var React   = require('react'),
    Router  = require('react-router'),

{ RouteHandler, Link } = Router;


var RegisterWithPayment = React.createClass({

    render () {

        return (
            <div>
                <div id="modal-auth" role="dialog" className="modal in light-brd">
                    <div className="modal-dialog">
                        <nav className="modal-nav modal-header">
                            <ul className="list-unstyled list-inline">
                                <li><Link to="RegisterName">Navn &amp; Adresse</Link></li>
                                <li><Link to="RegisterSubscription">Abonnement</Link></li>
                                <li><Link to="RegisterFinish">Betaling</Link></li>
                            </ul>
                        </nav>
                        <div className="modal-content">
                            <RouteHandler {...this.props} />
                        </div>
                    </div>
                </div>

                <div className="full-page register faded"></div>
            </div>
        );
    }

});

module.exports = RegisterWithPayment;
