/** @jsx React.DOM */

var React = window.React = require('react');
var FantnActions = require('../../actions/FantnActions');

var ItemForm = React.createClass({

    getInitialState () {
        return {
            file: '',
        };
    },

    handleSubmit (e) {
        e.preventDefault();

        var formData = {
            name : this.refs.name.getDOMNode().value.trim() || this.props.data.name,
            description : this.refs.description.getDOMNode().value.trim() || this.props.data.description,
            selectedStatus : this.refs.statusAvailable.getDOMNode().checked ? 'Tilgjengelig' : 'Mistet',
            id : this.props.id,
            file : this.state.file
        };

        FantnActions.editQRItem(formData);

        // this.props.onSubmit(formData);
    },

    __handleFile (e) {
        this.setState({file : e.target.files[0]});
    },

    render () {
    return (
        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <h4>Endre Enhet</h4>
            <div className="row">

                <div className="col-sm-6">
                    <div className="form-group">
                        <label>Tittel</label>
                        <input type="text" ref="name" className="form-control" placeholder={this.props.data.name} />
                    </div>

                    <div className="form-group">
                        <label>Beskrivelse</label>
                        <input type="text" ref="description" className="form-control" placeholder={this.props.data.description} />
                    </div>

                    <div className="form-group">
                        <label className="mrs">Status</label>
                        <label className="radio-inline">
                            <input type="radio" ref="statusAvailable" name="selectedStatus" value="available" defaultChecked={true}/>
                                Tilgjengelig
                         </label>

                         <label className="radio-inline">
                             <input type="radio" ref="statusLost" name="selectedStatus" value="lost"/>
                                 Mistet
                          </label>
                    </div>
                </div>

                <div className="col-sm-6">
                    <div className="form-group">
                        <label htmlFor="image">Last opp et bilde av enheten</label>
                        <input type="file" name="image" ref="image" onChange={this.__handleFile}/>
                    </div>

                    <input type="submit" className="btn btn-success" value="Lagre" />
                </div>
            </div>
        </form>
    );
    }
});

module.exports = ItemForm;
