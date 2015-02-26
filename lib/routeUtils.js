var keystone = require('keystone');

module.exports.error = function (res, err) {
    return res.status(500).json({ error: err });
}

module.exports.json = function (res, result) {
    return res.json(result);
}

module.exports.getUrl = function () {
    return (keystone.get('env') === 'production') ? 'http://fantn.herokuapp.com/' : 'http://fantn.herokuapp.com/';
    // return 'http://127.0.0.1:5000/';
}
