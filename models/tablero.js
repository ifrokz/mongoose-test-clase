const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const TableroSchema = mongoose.Schema({
    name: String,
    _creator: String
})

const Tablero = mongoose.model('Tableros', TableroSchema);

module.exports = Tablero;