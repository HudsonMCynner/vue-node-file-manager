const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    encodedName: { type: String, max: 100, default: null },
    path: { type: String, max: 100, default: null },
    mimetype: { type: String, default: null },
    size: { type: Number },
    folder: { type: Boolean, default: false }
});

module.exports = mongoose.model('file', FileSchema, 'files');
