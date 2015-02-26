// Papertrail = add to here

module.exports = {

    // Services
    redis_url: (process.env.REDISCLOUD_URL || 'redis://localhost:6379') + '/0',
    mongo_url: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/fantn',
    rabbit_url: process.env.CLOUDAMQP_URL || 'amqp://localhost',
    // port: int(process.env.PORT) || 5000,

    // Security
    cookie_secret: process.env.COOKIE_SECRET || 'myCookieSecret',
    blitz_key: process.env.BLITZ_KEY || '',

    // App behavior
    verbose: bool(process.env.VERBOSE) || false,          // Log 200s?
    concurrency: int(process.env.CONCURRENCY) || 1,       // Number of Cluster workers to fork
    worker_concurrency: int(process.env.WORKER_CONCURRENCY) || 1,
    thrifty: bool(process.env.THRIFTY) || false,          // Web process also executes job queue?
    timeout: int(process.env.TIMEOUT) || 5000,            // Request timeouts
    busy_ms: int(process.env.BUSY_MS) || 5000,            // Event loop lag threshold for 503 responses
    view_cache: bool(process.env.VIEW_CACHE) || false,    // Cache rendered views?

    // Benchmarking
    benchmark: bool(process.env.BENCHMARK) || false,
    benchmark_add: float(process.env.BENCHMARK_ADD) || 0.02,
    benchmark_vote: float(process.env.BENCHMARK_VOTE) || 0.12,
    email: {
        toAddr : 'bjorn@eye4it.no'
    },

    temporize_url : 'https://yVFwwg2ORIii8046lFb5rQ:vq2b7s6j9ej9vftvrqreblt3@api.temporize.net',

    paypal : {
        'host' : 'api.sandbox.paypal.com',
        'port' : '',
        'client_id' : 'AYDVVBC7jUKbxRz53UheW_Qh31nPvWHuN_nwINQi4QSoHol9l0RazcwxY_E0',
        'client_secret' : 'EEBMWRAS0lzeVipwl8EBU3-UW79s-W10Hq4zBHdY3a66yXUeqtOC5gTQPRaE'
    }
};

function bool(str) {
    if (str == void 0) return false;
    return str.toLowerCase() === 'true';
}

function int(str) {
    if (!str) return 0;
    return parseInt(str, 10);
}

function float(str) {
    if (!str) return 0;
    return parseFloat(str, 10);
}
