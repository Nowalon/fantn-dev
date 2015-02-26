var jackrabbit = require('jackrabbit');
var logger = require('logfmt');
var EventEmitter = require('events').EventEmitter;

function Connector(rabbitUrl) {
    EventEmitter.call(this);

    var self = this;
    var readyCount = 0;

    this.queue = jackrabbit(rabbitUrl)
    .on('connected', function() {
        logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
        ready();
    })
    .on('error', function(err) {
        logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
    })
    .on('disconnected', function() {
        logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
        lost();
    });

    function ready() {
        readyCount += 1;
        if ( readyCount === 1) {
            self.emit('ready');
        }
    }

    function lost() {
        self.emit('lost');
    }
};

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = function(rabbitUrl) {
    return new Connector(rabbitUrl);
};
