var logger = require('logfmt');
var request = require('superagent');
var config = require('../../lib/config');
var utils = require('../../lib/routeUtils');


module.exports = function scheduleRetryService (opts) {

    // logging only
    var d = new Date();
    d.setMinutes(d.getMinutes() + 2);

    var cb = utils.getUrl() + 'api/smsapi/retries/' + opts._id.toString();

    var url = config.temporize_url + '/v1/events/when/' + d.toString() + '/' + cb;

    logger.log({type: 'info', what : 'TEMPORIZE URL', url : url});

    request.post(url);
}
