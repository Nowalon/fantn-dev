// /** @jsx React.DOM */
//
// var React = require('react/addons');
//
// var MessageModal = React.createClass({
//
//     // TODO: move up to base modal
//     __onClose : function () {
//         App.radio('modal:close').broadcast();
//     },
//
//     render : function () {
//
//         // can be used to show icons or images
//         var media;
//         if ( this.props.icon ) {
//             media = <i className={"icon i-3x " + this.props.icon} />;
//         }
//
//         return (
//             <div className="modal-content pal shadow-modal">
//                 <div className="row">
//                     <div className="col-sm-9">
//                         <h3>{this.props.message}</h3>
//                     </div>
//                     <div className="col-sm-3">
//                         <button className="btn mts" onClick={this.__onClose}>OK</button>
//                     </div>
//                 </div>
//
//                 <div className="modal-footer">
//                     <div className="row">
//
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// });
//
// module.exports = MessageModal;
