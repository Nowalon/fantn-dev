var q = require('q');
var keystone = require('keystone');
var Issue = keystone.list('Issue');

function verifySenderIsQROwner (qrCode, gsm) {
    var user = qrCode.owner;

    if (user.mobile && user.mobile.indexOf(gsm) > -1) { return true; }
    if (user.mobile2 && user.mobile2.indexOf(gsm) > -1 ) { return true; }
    if (user.mobile3 && user.mobile3.indexOf(gsm) > -1 ) { return true; }

    return false;
}

var findIssueForQrCode = function (body, qrCode) {
    var def = q.defer();

    body.__qrCode = qrCode;
    Issue.model.findOne()
    .where({serialNumber : qrCode.serialNumber, issueSolved : false})
    .exec()
    .then(function (issue) {

        // No issue found on this qrCode. Expect item found message
        if (!issue) {
            body.__status = 'Item found';
            return def.resolve(body);
        }


        // There is an issue here already. Expect either finder reminds, or item returned


        // Owner has scanned the object.
        // TODO: ta høyde for at misteren kan skanne koden selv
        if( verifySenderIsQROwner(qrCode, body.gsm) ) {

            body.__status = 'Item returned';
            body.__issue = issue;
            return def.resolve(body);
        }

        else if ( issue.findersGSM.indexOf(body.gsm) > -1) {
            body.__status = 'Finder reminds';
            return def.resolve(body);

        } else {
            return def.resolve('');
        }

    }, function (err) {
        return def.reject(err);
    });

    return def.promise;
};


module.exports = findIssueForQrCode;
