var React = require('react');
var Router  = require('react-router');

var { RouteHandler, Link } = Router;


var MeView = React.createClass({

    render () {
        return (
            <div className="row body">
                <div className="col-sm-2">
                    <nav className="sidenav">
                        <ul className="list-unstyled">
                            <li>
                                <Link to="ItemsView" className="nav-btn">
                                    <span className="icon-2x ion-briefcase"></span>
                                    <p>Gjenstander</p>
                                </Link>
                            </li>
                            <li className="nav-btn">
                                <Link to="ProfileView" className="nav-btn">
                                    <span className="icon-2x ion-person"></span>
                                    <p>Min Profil</p>
                                </Link>
                            </li>

                            <li className="nav-btn">
                                <Link to="PaymentsView" className="nav-btn">
                                    <span className="icon-2x ion-card"></span>
                                    <p>Mine Betalinger</p>
                                </Link>
                            </li>

                            <li className="bottom">
                                <a href="/signout">
                                    <span className="icon-2x ion-log-out"></span>
                                    <p>Logg Ut</p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div id="content" className="col-sm-10">
                    <p className="text-muted">Min Profil</p>
                    <RouteHandler {...this.props} />
                </div>
            </div>
        );
    }
});

module.exports = MeView;
