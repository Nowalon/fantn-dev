var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;
var handleIncomingSmsService = require('../../services/sms/handleIncomingSmsService');
var connections = require('./connections');

var SMS_QUEUE = 'jobs.sms';

function App(config) {

    EventEmitter.call(this);

    this.connections = connections(config.rabbit_url);

    this.connections.once('ready', this.onConnected.bind(this));
    this.connections.once('lost', this.onLost.bind(this));
    this.__id = uuid.v1();
}

module.exports = function createApp(config) {
    return new App(config);
};

App.prototype = Object.create(EventEmitter.prototype);


App.prototype.onConnected = function() {
    var queues = 0;
    this.connections.queue.create(SMS_QUEUE, { prefetch: 5 }, onCreate.bind(this));

    function onCreate() {
        queues++;

        if ( queues === 1) {
            this.onReady();
        }
    }
};

App.prototype.onReady = function() {
    logger.log({ type: 'info', msg: 'app.ready' });
    this.emit('ready');
};

App.prototype.onLost = function(err) {
    logger.log({ type: 'info', msg: 'app.lost', err: err });
    this.emit('lost');
};

// add incoming sms job
App.prototype.triggerHandleSMSJob = function (opts) {
    var id = uuid.v1();
    this.connections.queue.publish(SMS_QUEUE, { id: id, opts: opts });
    return Promise.resolve('NORETURN');
}

// send sms
App.prototype.handleSMS = function(opts, id) {
    return handleIncomingSmsService(opts, id);
};


App.prototype.startWorking = function() {
    this.connections.queue.handle(SMS_QUEUE, this.onHandleSMSJob.bind(this));
    return this;
};

App.prototype.onHandleSMSJob = function(job, ack) {
    logger.log({ type: 'info', msg: 'handling SMS job', queue: SMS_QUEUE, gsm: job.opts.gsm, tekst: job.opts.tekst, id : job.id });

    this
    .handleSMS(job.opts, job.id)
    .then(onSuccess, onError);

    function onSuccess() {
        logger.log({ type: 'info', msg: 'job complete', status: 'success', id: job.id });
        ack();
    }

    function onError() {
        logger.log({ type: 'info', msg: 'job complete', status: 'failure', id: job.id });
        ack();
    }
};
