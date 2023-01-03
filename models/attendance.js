const mongoose = require('mongoose')
const {Schema} = mongoose;

const attdSchema = new mongoose.Schema({
        ts: Date,
        pf: String,
        attendance: String,
});

const Attd = mongoose.model('attendance', attdSchema);

module.exports = Attd;