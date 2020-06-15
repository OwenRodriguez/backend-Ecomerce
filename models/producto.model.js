'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({

    nombreProducto: String,
    cantidad: Number,
    precio: Number,
    sale: Number
});


module.exports = mongoose.model('producto', productoSchema);