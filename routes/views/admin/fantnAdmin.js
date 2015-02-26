var keystone    = require('keystone'),
    QrCode      = keystone.list('QrCode'),
    User        = keystone.list('User'),
    Issue        = keystone.list('Issue'),
    Event        = keystone.list('Event'),
    moment 		= require('moment'),
    async       = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'session';

    view.query('qrCodes', QrCode.model.find().sort({'created': '-1'}).populate('owner'));
    view.query('users', User.model.find());
    view.query('issues', Issue.model.find());
    view.query('events', Event.model.find());
    locals.bsUser = req.user.toJSON();

    view.render('admin/fantnAdmin');

}
