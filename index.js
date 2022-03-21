const {MongoDB} = require(`./adapters/Mongo/MongoDB`);
const {Database} = require(`./adapters/Database`)

exports.Database = Database;
exports.MongoDB = MongoDB;