// /** @jsx React.DOM */
//
// var App = global.App;
//
// var BaseModal = require('./components/modal/BaseModal');
//
// var AppController = function () {}
// var proto = AppController.prototype;
//
// proto.init = function () {
//     App.radio('modal:open').subscribe(this.openModal.bind(this));
//     App.radio('modal:close').subscribe(this.closeModal.bind(this));
// };
//
// proto.exec = function (model, action, options) {
//     options = options || {};
//
//     var config = {
//         success : function (res) {
//
//             if (options.event) {
//                 App.radio(options.event + ':success', res);
//             }
//
//             if (options.success) {options.success(res);}
//         },
//
//         error : function (err) {
//             if ( options.event ) {
//                 App.radio(options.event + ':fail', res);
//             }
//
//             if (options.fail) {options.fail(err);}
//         }
//     };
//
//     model[action](config);
// }
//
// proto.openModal = function (modalBodyView) {
//     var modalEl = document.getElementById('modal-region');
//     React.renderComponent( <BaseModal modalBody={modalBodyView} />, modalEl);
// }
//
// proto.closeModal = function (next) {
//     var modalEl = document.getElementById('modal-region');
//     React.unmountComponentAtNode(modalEl);
//     App.radio('modal:close:post').broadcast();
//
//     if (next) {
//         next();
//     }
// }
//
//
//
// module.exports = AppController;
