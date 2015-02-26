// var config = require('./config');
//
// module.exports = {
//     "Open Landing page" : function (browser) {
//         browser
//         .url(config.url)
//         .waitForElementVisible('body', config.waitTime)
//         .assert.title('FANTN · It\'s Never Lost')
//         .assert.containsText('#heading', 'FantN')
//         .end();
//     },
//
//     "Click on become member" : function (browser) {
//         browser
//         .url(config.url)
//         .waitForElementVisible('body', config.waitTime)
//         .click('a[href="/join"]')
//         .waitForElementVisible('#join-header', config.waitTime)
//         .assert.containsText('#join-header', 'Bli Medlem Hos FANTN')
//         .setValue('input[name="email"]', 'sapdap@mail.com')
//         .setValue('input[name="password"]', 'yoloswagtown')
//         .click('button[type="submit"]')
//         .waitForElementVisible('input#email', config.waitTime)
//         .assert.valueContains("input#email", "sapdap@mail.com")
//         .end();
//     },
//
//
// };
