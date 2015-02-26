/** @jsx React.DOM */

var React = require('react/addons'),
    ImageReader = require('../ImageReader');

var ProfileForm = React.createClass({

    getInitialState : function () {

        // if the user has chosen a new image,
        // display this immediately instead of profile the picture.
        return {formImage : ''};
    },

    __imageChanged : function (e) {
        this.refs.uploadTxt.getDOMNode().innerText = 'Takk, trykk Lagre for å laste opp bildet';
        var file = e.target.files[0];
        this.setState({formImage : file });
        this.props.onChange(file);
    },

    render : function () {

        var image;

        if (this.state.formImage ) {
            image = <ImageReader file={this.state.formImage} classes={'img-8'} />;

        } else if (this.props.user.photo) {
            image = <img src={this.props.user.photo} className="img-8" />;

        } else {
            image = <i className="icon ion-ios7-camera i-huge" />;
        }

        return (
            <div className="row">
                {image}
                <p><strong ref="uploadTxt">Last opp profilbilde</strong></p>
                <input type="file" onChange={this.__imageChanged} className="mvm centerify"/>
            </div>
        );
    }
});
module.exports = ProfileForm;
