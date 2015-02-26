/** @jsx React.DOM */

var React = require('react/addons');
var FantnActions = require('../../actions/FantnActions');
var _every = require('lodash-node/underscore/collections/every');
var _contains = require('lodash-node/underscore/collections/contains');


var VALID_ICON = 'valid ion-checkmark-round';
var INVALID_ICON = 'valid color5 ion-asterisk';

var EMAIL_RE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var POSTCODE_RE = /^[0-9]{4}$/;
var MOBILE_LAND_RE = /^[0-9]{2,4}$|^\+[0-9]{1,4}$/;
var MOBILE_RE = /^[0-9]{8,10}$/;

// Fields that are not required
var NOT_REQ = ['adress2', 'mobile2Land', 'mobile2', 'mobile3Land', 'mobile3', 'file'];


var ProfileForm = React.createClass({

    getInitialState () {
        var form = {
            firstName : this.props.user.name ? this.props.user.name.first : '',
            lastName : this.props.user.name ? this.props.user.name.last : '',
            email : this.props.user.email,
            adress : this.props.user.adress,
            adress2 : this.props.user.adress2,
            postCode: this.props.user.postCode,
            city : this.props.user.city,
            country : this.props.user.country,
            mobile : this.props.user.mobile,
            mobileLand : this.props.user.mobileLand,
            mobile2Land : this.props.user.mobile2Land,
            mobile2 : this.props.user.mobile2,
            mobile3Land : this.props.user.mobile3Land,
            mobile3 : this.props.user.mobile3,
            file : this.props.user.file
        };

        var validations = {};
        Object.keys(form).forEach((key) => {

            // field is valid
            if (form[key]) {
                validations[key] = VALID_ICON;

            // invalidate at first
            } else if (!_contains(NOT_REQ, key)) {
                validations[key] = INVALID_ICON;

            // not a required field
            } else {
                validations[key] = '';
            }
        });

        return {
            validations : validations,
            form : form,
            errorMsg : ''
        };
    },

    componentWillReceiveProps (props) {
        if ( props.user.file ) {
            var form = this.state.form;
            form.file = props.user.file;
            this.setState({form : form});
        }

        if (props.didHitSubmit === true) {
            this.submitForm();
        }
    },

    submitForm () {
        var isValid = _every(Object.keys(this.state.validations), (v) => {
            if (_contains(NOT_REQ, v)) return true;
            return this.state.validations[v] === VALID_ICON;
        });

        if (isValid) {
            var data = this.state.form;
            data.id = this.props.user.id;
            FantnActions.submitProfileForm(this.state.form);

            // form submitted but is not valid
        } else {
            this.setState({errorMsg : 'Fyll ut alle obligatoriske felter'});
        }
    },

    validateAndSetState (refName, condition, value, noValidation) {

        var newState = this.state;

        if (condition) {
            newState.validations[refName] = VALID_ICON;

        } else {
            var icon = noValidation === true ? '' : INVALID_ICON;
            newState.validations[refName] = icon;
        }

        newState.form[refName] = value;
        this.setState(newState);
    },


    __onRequiredChange (refName, e) {
        var value = e.target.value;
        var condition = value.length >= 2;
        this.validateAndSetState(refName, condition, value);
    },

    __onRequireEmailBlur (e) {
        var value = e.target.value;
        var condition = EMAIL_RE.test(value);
        this.validateAndSetState('email', condition, value);
    },

    __onRequirePostcodeBlur (e) {
        var value = e.target.value;
        var condition = POSTCODE_RE.test(value);
        this.validateAndSetState('postCode', condition, value);
    },

    __onRequiredMobileLandBlur (refName, e, noValidation) {
        var val = e.target.value.trim().replace(/\s/g, '');
        this.refs[refName].getDOMNode().value = val;
        var condition = MOBILE_LAND_RE.test(val);
        this.validateAndSetState(refName, condition, val, noValidation);
    },

    __onRequiredMobileBlur (refName, e, noValidation) {
        var val = e.target.value.trim().replace(/\s/g, '');
        this.refs[refName].getDOMNode().value = val;
        var condition = MOBILE_RE.test(val);
        this.validateAndSetState(refName, condition, val, noValidation);
    },

    __onMobileBlur (refName, e) {
        this.__onRequiredMobileBlur(refName, e, true);
    },

    __onMobileLandBlur (refName, e) {
        this.__onRequiredMobileLandBlur(refName, e, true);
    },

    __onChange (refName, e) {
        var form = this.state.form;
        form[refName] = e.target.value;
        this.setState({form : form});
    },

    __onSubmit (e) {
        e.preventDefault();
        this.submitForm();
    },

    render  () {
        var validationIcons = this.state.validations;

        return (
            <form onSubmit={this.__onSubmit}>
                <div className="row register-form">
                    <p className="error">{this.state.errorMsg}</p>

                    <div className="row">
                        <div className="rel form-group col-xs-6">
                            <label className="sr-only" htmlFor="firstName">Fornavn</label>
                            <i className={validationIcons.firstName}></i>
                            <input
                                type="text"
                                onChange={this.__onRequiredChange.bind(this, 'firstName')}
                                id="firstName"
                                ref="firstName"
                                className="form-control"
                                placeholder="Fornavn"
                                defaultValue={this.state.form.firstName}
                            />
                        </div>
                        <div className="rel form-group col-xs-6">
                            <label className="sr-only" htmlFor="lastName">Etternavn</label>
                            <i className={validationIcons.lastName}></i>
                            <input
                                type="text"
                                onChange={this.__onRequiredChange.bind(this, 'lastName')}
                                id="lastName"
                                ref="lastName"
                                className="form-control"
                                placeholder="Etternavn"
                                defaultValue={this.state.form.lastName}
                            />
                        </div>
                    </div>

                    <div className="rel form-group">
                        <label className="sr-only" htmlFor="email">Epost (brukes som brukernavn)</label>
                        <i className={validationIcons.email} style={{left : '-20px'}}></i>
                        <input
                            type="email"
                            onChange={this.__onRequireEmailBlur}
                            id="email"
                            ref="email"
                            className="form-control"
                            placeholder="Epost (brukes som brukernavn)"
                            defaultValue={this.props.user.email}
                            />
                    </div>

                    <div className="rel form-group">
                        <label className="sr-only" htmlFor="adress">Adresse 1</label>
                        <i className={validationIcons.adress} style={{left : '-20px'}}></i>
                        <input
                            type="text"
                            id="adress"
                            ref="adress"
                            onChange={this.__onRequiredChange.bind(this, 'adress')}
                            className="form-control"
                            placeholder="Adresse 1"
                            defaultValue={this.state.form.adress}
                        />
                    </div>

                    <div className="form-group">
                        <label className="sr-only" htmlFor="adress2">Adresse 2</label>
                        <input
                            type="text"
                            id="adress2"
                            ref="adress2"
                            onChange={this.__onChange.bind(this, 'adress2')}
                            className="form-control"
                            placeholder="Adresse 2"
                            defaultValue={this.state.form.adress2}
                        />
                    </div>

                    <div className="row">
                        <div className="form-group col-lg-4">
                            <label className="sr-only" htmlFor="postCode">Postkode</label>
                            <i className={validationIcons.postCode}></i>
                            <input
                                type="text"
                                id="postCode"
                                ref="postCode"
                                onChange={this.__onRequirePostcodeBlur}
                                className="form-control"
                                placeholder="Postkode"
                                defaultValue={this.state.form.postCode}
                                />
                        </div>
                        <div className="form-group col-lg-4">
                            <label className="sr-only" htmlFor="city">By</label>
                            <i className={validationIcons.city}></i>
                            <input
                                type="text"
                                id="city"
                                ref="city"
                                onChange={this.__onRequiredChange.bind(this, 'city')}
                                className="form-control"
                                placeholder="By"
                                defaultValue={this.state.form.city}
                                />
                        </div>

                        <div className="form-group col-lg-4">
                            <label className="sr-only" htmlFor="country">Land</label>
                            <i className={validationIcons.country}></i>
                            <input
                                type="text"
                                id="country"
                                ref="country"
                                onChange={this.__onRequiredChange.bind(this, 'country')}
                                className="form-control"
                                placeholder="Land"
                                defaultValue={this.state.form.country}
                                />
                        </div>
                    </div>

                    <label className="sr-only" htmlFor="mobile1">Mobilnummer 1 (Landskode + nummber)</label>
                    <div className="row">
                        <div className="form-group col-xs-4">
                            <i className={validationIcons.mobileLand}></i>
                            <input
                                type="text"
                                id="mobileLand"
                                ref="mobileLand"
                                onChange={this.__onRequiredMobileLandBlur.bind(this, 'mobileLand')}
                                className="form-control"
                                placeholder="Landskode (eks '0047')"
                                defaultValue={this.state.form.mobileLand}
                                />
                        </div>
                        <div className="form-group col-xs-8">
                            <i className={validationIcons.mobile}></i>
                            <input
                                type="text"
                                id="mobile"
                                ref="mobile"
                                className="form-control"
                                placeholder="Mobilnummer 1"
                                onChange={this.__onRequiredMobileBlur.bind(this, 'mobile')}
                                defaultValue={this.state.form.mobile}
                                />
                        </div>
                    </div>

                    <label className="sr-only" htmlFor="mobile1">Mobilnummer 2 (Landskode + nummber)</label>
                    <div className="row">
                        <div className="form-group col-xs-4">
                            <i className={validationIcons.mobile2Land}></i>
                            <input
                                type="text"
                                id="mobile2Land"
                                ref="mobile2Land"
                                className="form-control"
                                placeholder="Landskode (eks '0047')"
                                onChange={this.__onMobileLandBlur.bind(this, 'mobile2Land')}
                                defaultValue={this.state.form.mobile2Land}
                            />
                        </div>
                        <div className="form-group col-xs-8">
                            <i className={validationIcons.mobile2}></i>
                            <input
                                type="text"
                                id="mobile2"
                                ref="mobile2"
                                onChange={this.__onMobileBlur.bind(this, 'mobile2')}
                                className="form-control"
                                placeholder="Mobilnummer 2"
                                defaultValue={this.state.form.mobile2}
                            />
                        </div>
                    </div>

                    <label className="sr-only" htmlFor="mobile1">Mobilnummer 3 (Landskode + nummber)</label>
                    <div className="row">
                        <div className="form-group col-xs-4">
                            <i className={validationIcons.mobile3Land}></i>
                            <input
                                type="text"
                                id="mobile3Land"
                                ref="mobile3Land"
                                onChange={this.__onMobileLandBlur.bind(this, 'mobile3Land')}
                                className="form-control"
                                placeholder="Landskode"
                                defaultValue={this.state.form.mobile3Land}
                            />
                        </div>
                        <div className="form-group col-xs-8">
                            <i className={validationIcons.mobile3}></i>
                            <input
                                type="text"
                                id="mobile3"
                                ref="mobile3"
                                onChange={this.__onMobileBlur.bind(this, 'mobile3')}
                                className="form-control"
                                placeholder="Mobilnummer 3"
                                defaultValue={this.state.form.mobile3}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = ProfileForm;
