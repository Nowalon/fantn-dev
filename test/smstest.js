// var request = require('request');
// var assert = require('assert');
//
// var url = 'http://cpa.eurobate.com/push.php?' +
//     qs.stringify({
//         bruker: 'Supperaadet',
//         'passord' : 'suppe234raad',
//         'til' : '98628425',
//         avsender : '2030',
//     });
//
// iconv.extendNodeEncodings();
//
// var buf = new Buffer('melding=når åæø! paa', 'binary');
// assert(Buffer.isEncoding('latin1'));
//
// var options = {
//     url : url,
//     method: 'post',
//     headers : {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
//     },
//     body : buf
// };
//
// request(options, function (error, response, body) {
//
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }else {
//         console.log('err: ' + error);
//     }
// });
