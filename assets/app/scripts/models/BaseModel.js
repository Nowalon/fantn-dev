// TODO: GET RID OF REQWEST
var extend  = require('lodash').extend,
    // reqwest = require('reqwest'),
    agent = require('superagent');


var BaseModel = function (attributes, options) {
    options || (options = {});
    extend(this.state, attributes);
}

extend(BaseModel.prototype, {

    state : {

    },

    toJSON : function () {
        return this.state;
    },

    toString : function () {
        return JSON.stringify(this.toJSON());
    },

    onXhrReturn : function (options, error, res) {

        if(error && error.message !== 'Parser is unable to parse the response') {
            options.error(this.state, error);
        } else {
            var body = res ? res.body : {};
            this.state = extend(this.state, body);
            options.success(this.toJSON());
        }
    },

    // XHR
    execXhr : function (method, options) {
        if(!this.state.url) {throw new Error('Url not defined for model: ' + this.toString()); }

        var model = this;
        agent
        .post(this.state.url)
        .send(model.toJSON())
        .set('Accept', 'application/json')
        .end(this.onXhrReturn.bind(this, options));


        // reqwest({
        //     url : this.state.url,
        //     type: 'json',
        //     method : method,
        //     data : model.toJSON(),
        //     error : function (err) {
        //         options.error(model, err);
        //     },
        //     success : function (res) {
        //         model.state = extend(model.state, res);
        //         options.success(model.state);
        //     }
        // });
    },

    execMultipartXhr : function (method, options) {
        if(!this.state.url) {throw new Error('Url not defined for model: ' + this.toString()); }
        var model = this;

        var req = agent.put(this.state.url).attach('photo_upload', this.state.file);

        Object.keys(model.state).forEach(function (key) {
            req.field(key, this.state[key]);
        }.bind(this));

        req.end(this.onXhrReturn.bind(this, options));
    },

    put : function (options) {
        if (this.state.file) {
            this.execMultipartXhr('put', options);
        } else{
            this.execXhr('put', options);
        }
    },

    create : function (options) {
        this.execXhr('post', options);
    }
});


module.exports = BaseModel;
