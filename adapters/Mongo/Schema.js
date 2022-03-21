const mongoose = require(`mongoose`);
const DefaultSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

module.exports = (connection, name) => connection.model(name, DefaultSchema);