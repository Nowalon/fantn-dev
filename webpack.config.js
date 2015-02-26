var webpack = require('webpack'),
    path    = require('path');

module.exports = {
    entry: {
        registerApp : './assets/app/scripts/registerApp',
        profileApp : './assets/app/scripts/profileApp'
    },
    devtool: 'eval',
    output: {
        path: path.join(__dirname, 'public', 'dist', 'scripts'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.jsx$/, loaders: ['jsx?harmony'] },
        ]
    }
};
