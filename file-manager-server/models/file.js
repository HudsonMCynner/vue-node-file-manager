const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
    name: {type: String, required: true, max: 100},
    encodedName: {type: String, required: false, max: 100, default: null},
    path: {type: String, required: false, max: 100, default: null},
    size: {type: Number, required: false }
});

module.exports = mongoose.model('file', FileSchema, 'files');
