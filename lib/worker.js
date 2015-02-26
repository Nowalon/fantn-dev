var keystone = require('keystone');
var http = require('http');
var logger = require('logfmt');
var throng = require('throng');
var fs = require('fs');
var config = require('./config');
var mongoose = require('mongoose');

http.globalAgent.maxSockets = Infinity;

keystone.init({
    'name': 'Fantn Worker'
});

keystone.set('cloudinary config', { cloud_name: 'fantn', api_key: '287114433772663', api_secret: 'JDyFFtP4SOyQ6yXDa7PStTdzR9g' });


// mandrill email service
// TODO: create a new mandrill account on Fantn AS and remove the current account.
keystone.set('mandrill api key', 'ft5pmj-khE04NmOw-MPfVQ');
keystone.set('mandrill username', 'michaelgunnulfsen@gmail.com');


// var models;
keystone.import('../models');
keystone.mongoose.connect(config.mongo_url);
keystone.mongoose.connection.on('open', function() {

    throng(start, { workers: config.worker_concurrency });

});


function start() {

    logger.log({
        type: 'info',
        msg: 'starting worker',
        concurrency: config.concurrency
    });


    var instance = require('./app')(config);
    process.on('SIGTERM', gracefullShutdown);
    process.on('uncaughtException', gracefulExit);

    instance.on('ready', beginWork);

    function beginWork() {
        instance.on('lost', gracefullShutdown);
        instance.startWorking();
    }

    function gracefullShutdown (err) {
        logger.log({ type: 'info', msg: 'Shutting down', err:err });
        process.exit();
    }

    function gracefulExit(err) {
        logger.error({ type: 'error', msg: 'Uncaught Exception', stack: err.stack });
        process.exit(1);
    }
}
