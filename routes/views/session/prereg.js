var keystone = require('keystone'),
    PreUser = keystone.list('PreUser'),
    logger = require('logfmt'),
    async = require('async');

exports = module.exports = function(req, res) {


    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'session';
    locals.form = req.body;

    view.on('post', { action: 'prereg' }, function(next) {

        var body = req.body;

        if (!body.email && !body.number) {
            req.flash('error', 'Du må fylle inn enten epost eller telefonnummer.');
            return res.redirect('/prereg');
        }

        var userData = {
            email: body.email,
            mobile: body.number || ''
        };


        var newUser = new PreUser.model(userData);

        newUser.save(function(err, result) {


            if (err) {
                logger.log({type : 'error', msg : 'PREREG USER ERROR', err: err});
                req.flash('error', 'Noe gikk galt under lagring');
            } else {
                logger.log({type : 'info', msg : 'PREREG USER', email : result.email, mobile : result.mobile});
                req.flash('success', 'Takk for at du registrerte deg!');
            }

            res.redirect('/');
        });
    });

    view.render('session/prereg');
}
