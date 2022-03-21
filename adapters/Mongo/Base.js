const events = require(`events`);
const mongoose = require(`mongoose`);
class Base extends events.EventEmitter {
    constructor (mongoConnectURL, options = {}) {
        super();
        if (!mongoConnectURL || !mongoConnectURL.startsWith(`mongodb`)) throw new Error(`Please specify a valid Mongo connect URL!`);
        if (options && typeof options !== `object`) throw new Error(`Options you specified is not an object!`);
        
        this.options = options;
        this.mongoURL = mongoConnectURL;
        this.connection = this._connect(this.mongoURL);
        this.connection.on(`open`, () => {this.connectedAt = new Date()});
    };

    _connect(mongoURL) {
        this.options.useCreateIndex = true;
        this.options.useNewUrlParser = true;
        this.options.useUnifiedTopology = true;
        this.options.useFindAndModify = false;
        return mongoose.createConnection(this.mongoURL, this.options);
    };

    _disconnect() {
        return this.connection.close(true)
    };
};

exports.Base = Base;