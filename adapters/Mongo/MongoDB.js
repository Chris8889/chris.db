const Util = require(`../../util/index`);
const lodash = require(`../../util/lodash`);
const Base = require(`./Base`);
const Schema = require(`./Schema`);

var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
    function adopt(value) {return value instanceof P ? value : new P(function(resolve) {resolve(value)})};

    return new(P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {try {step(generator.next(value))} catch (e) {reject(e)}};
        function rejected(value) {try {step(generator[`throw`](value))} catch (e) {reject(e)}};
        function step (result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)};
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class MongoDB extends Base.Base {
    constructor (mongoConnectURL, name = `chrisdb`, options = {}) {
        super(mongoConnectURL, options);
        this.schema = Schema(this.connection, name);
    };
    
    get (key) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            const arr = key.split(`.`);
            const data = yield this.schema.findOne({key: arr[0]});
            if (!data) return null;

            if (arr.length > 1) {
                if (data.value && typeof data.value === `object`) return lodash.get(data.value, arr.slice(1).join(`.`));
                return null;
            }; return data.value;
        });
    };
    
    fetch (key) {
        return this.get(key);
    };
    
    has (key) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            const arr = key.split(`.`);
            const data = yield this.schema.findOne({key: arr[0]});

            if (arr.length > 1) {
                if (data.value && typeof data.value === `object`) return !!(yield this.get(key));
            } else return !!data;
        });
    };
    
    set (key, value) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            if (!value) throw new Error(`Please specify a valid value!`);

            const parsed = Util.parseObject(lodash.set({}, key, value));
            return this.schema.findOneAndUpdate({key: parsed.key}, {$set: {value: parsed.value}}, {upsert: true, new: true});
        });
    };
    
    delete (key) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            const arr = key.split(`.`);
            const data = yield this.schema.findOne({key: arr[0]});

            if (!data) return false;
            if (data.value && typeof data.value === `object`) {
                const newData = lodash.unset(data.value, arr[arr.length - 1]);
                this.schema.findOneAndUpdate({key: arr[0]}, {$set: {value: newData}});
                return true;
            };

            this.schema.deleteOne({key: arr[0]});
            return true;
        });
    };
    
    add (key, count) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            if (!count) throw new Error(`Please specify a valid count!`);

            const data = (yield this.get(key)) || 0;
            if (isNaN(data)) throw new Error(`Data is not a number!`);
            return this.set(key, data + count);
        });
    };
    
    subtract (key, count) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            if (!count) throw new Error(`Please specify a valid count!`);

            const data = (yield this.get(key)) || 0;
            if (isNaN(data)) throw new Error(`Data is not a number!`);
            return this.set(key, data - count);
        });
    };
    
    push (key, el) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            if (el !== 0 && !el && typeof el !== `boolean`) throw new Error(`Please specify a valid element!`);

            const data = (yield this.get(key)) || [];
            if (!Array.isArray(data)) throw new Error(`Data is not an array!`);
            data.push(el);
            return this.set(key, data);
        });
    };
    
    pull (key, el) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!key) throw new Error(`Please specify a valid key!`);
            if (el !== 0 && !el && typeof el !== `boolean`) throw new Error(`Please specify a valid element to pull!`);

            const data = (yield this.get(key)) || [];
            if (!Array.isArray(data)) throw new Error(`The data is not a array!`);
            const newData = data.filter((x) => x !== el);
            return this.set(key, newData);
        });
    };
    
    all () {
        return __awaiter(this, void 0, void 0, function*() {
            return this.schema.find({});
        });
    };
    
    clear () {
        return __awaiter(this, void 0, void 0, function*() {
            return this.schema.deleteMany({});
        });
    };
    
    uptime () {
        if (!this.connectedAt) return 0;
        return Date.now() - this.connectedAt.getTime();
    };
    
    connect (url) {
        return this._connect(url);
    };
    
    disconnect () {
        return this._disconnect();
    };
    
    updateSchema (name) {
        return __awaiter(this, void 0, void 0, function*() {
            this.schema = Schema(yield this.connection, name);
            return this.schema;
        });
    };
    
    createSchema (name) {
        if (!name) throw new Error(`Please provide a valid schema name!`);
        return new MongoDB(this.mongoURL, name, this.options);
    };
    
    createDatabase (dbName) {
        return __awaiter(this, void 0, void 0, function*() {
            if (!dbName) throw new Error(`Please provide a valid database name!`);
            return new MongoDB(this.mongoURL.replace((yield this.connection).name, dbName), this.schema.modelName, this.options);
        });
    };
    
    createCollection (dbName) {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this.createDatabase(dbName);
        });
    };
    
    dropDatabase() {
        return __awaiter(this, void 0, void 0, function*() {
            return (yield this.connection).dropDatabase();
        });
    };

    dropCollection() {
        return __awaiter(this, void 0, void 0, function*() {
            return yield this.dropDatabase();
        });
    };
};

exports.MongoDB = MongoDB;