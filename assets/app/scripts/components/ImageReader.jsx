/* global alert */
/** @jsx React.DOM */

var React = window.React = require('react');

var ImageReader = React.createClass({

    getInitialState : function () {
        return {src : ''};
    },

    checkBrowserCompability : function () {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            return true;
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    },

    componentDidMount : function () {
        this.checkBrowserCompability();

        var file = this.props.file;
        // Only process image files.
        if (!file.type.match('image.*')) {
            alert('Vennligst velg en bildefil');
        }

        var reader = new FileReader();
        // Read in the image file as a data URL.
        reader.readAsDataURL(file);

        var dat = this;
        reader.onload = (function() {
            return function(e) {
                dat.setState({src : e.target.result});
            };
        })(file);
    },

    render: function() {
        return (
            <img className={this.props.classes} src={this.state.src} />
        );
    }
});

module.exports = ImageReader;
