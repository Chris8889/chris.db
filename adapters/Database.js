const graceful_fs = require(`graceful-fs`);
const parent_module = require(`parent-module`);
const path = require(`path`);
const Util = require(`../util/index`);
const lodash = require(`../util/lodash`);

class Database {
    constructor (file = `chrisdb.json`) {
        this.cache = {};
        file = file.endsWith(`.json`) ? file : `${file}.json`;
        this.dbFilePath =
            file === `chrisdb.json` || path.isAbsolute(file)
                ? process.cwd() + path.sep + file
                : Util.absolute(path.dirname(parent_module()) + path.sep, file);

        if (graceful_fs.existsSync(this.dbFilePath)) this.cache = this.read();
        else graceful_fs.writeFileSync(this.dbFilePath, `{}`, `utf-8`);
    };
    
    get (key) {
        if (!key) throw new Error(`Please specify a valid key!`);
        return lodash.get(this.cache, key);
    };
    
    fetch (key) {
        if (!key) throw new Error(`Please specify a valid key!`);
        return this.get(key);
    };
    
    has (key) {
        if (!key) throw new Error(`Please specify a valid key!`);
        return lodash.has(this.cache, key);
    };
    
    set (key, value, options = {write: true, pretty: false}) {
        if (!key) throw new Error(`Please specify a valid key!`);
        if (typeof value !== `boolean` && value !== 0 && !value) throw new Error(`Please specify a valid value!`);

        lodash.set(this.cache, key, value);
        if (options.write) this.write(options);
        return this.get(key);
    };
    
    write (options = {write: true, pretty: false}) {
        const str = 
            options.pretty
                ? JSON.stringify(this.cache, null, 2)
                : JSON.stringify(this.cache);
        graceful_fs.writeFileSync(this.dbFilePath, str);
    };
    
    delete (key, options = {write: true,  pretty: false}) {
        if (!key) throw new Error(`Please specify a valid key!`);

        lodash.unset(this.cache, key);
        if (options.write) this.write(options);
        return true;
    };
    
    add (key, count, options) {
        if (!key) throw new Error(`Please specify a valid key!`);
        if (!count) throw new Error(`Please specify a valid count!`);

        const data = lodash.get(this.cache, key) || 0;
        if (isNaN(data)) throw new Error(`Data is not a number!`);
        this.set(key, data + count, options);
        return this.get(key);
    };
    
    subtract (key, count, options) {
        if (!key) throw new Error(`Please specify a valid key!`);
        if (!count) throw new Error(`Please specify a valid count!`);

        const data = lodash.get(this.cache, key) || 0;
        if (isNaN(data)) throw new Error(`Data is not a number`);
        this.set(key, data - count, options);
        return this.get(key);
    };
    
    push (key, el, options) {
        if (!key) throw new Error(`Please specify a valid key!`);
        if (el !== 0 && !el && typeof el !== `boolean`) throw new Error(`Please specify a valid element to push!`);

        const data = lodash.get(this.cache, key) || [];
        if (!Array.isArray(data)) throw new Error(`Data is not an array`);
        data.push(el);
        this.set(key, data, options);
        return this.get(key);
    };
    
    pull(key, el, options) {
        if (!key) throw new Error(`Please specify a valid key!`);
        if (el !== 0 && !el && typeof el !== `boolean`) throw new Error(`Please specify a valid element to pull!`);

        const data = lodash.get(this.cache, key) || [];
        if (!Array.isArray(data)) throw new Error(`The data is not a array!`);
        const newData = data.filter((x) => x !== el);
        this.set(key, newData, options);
        return this.get(key);
    };
    
    all () {
        return this.cache;
    };

    read () {
        return JSON.parse(graceful_fs.readFileSync(this.dbFilePath, {encoding: `utf-8`}) || `{}`);
    };
    
    clear () {
        this.cache = {};
        this.write();
        return true;
    };
    
    get _get() {
        const start = Date.now();
        this.get(`chrisdb`);
        return Date.now() - start;
    };
    
    get _set() {
        const start = Date.now();
        this.set(`chrisdb`, `chrisdb`);
        return Date.now() - start;
    };

    get ping() {
        const read = this._get;
        const write = this._set;
        const average = (read + write) / 2;
        this.delete(`chrisdb`);
        return {
            read: `${read}ms`,
            write: `${write}ms`,
            average: `${average}ms`
        };
    }
};

exports.Database = Database;