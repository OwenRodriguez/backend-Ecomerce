'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var carritoSchema = Schema({
    cliente: [{type: Schema.Types.ObjectId, ref: 'usuario'}],
    compra: [{
        nombreProducto: String,
        cantidad: Number,
        precio: Number,
        subtotal: Number
    }]
    
});

module.exports = mongoose.model('carrito', carritoSchema);