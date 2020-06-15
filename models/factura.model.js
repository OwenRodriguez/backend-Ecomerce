'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = Schema({
    nit: Number,
    fecha: Date,
    lugar: String,
    comprador: [{type: Schema.Types.ObjectId, ref: 'usuario'}],
    productos: [{
        nombreProducto: String,
        cantidad: String,
        precio: Number,
        subtotal: Number
    }],
    total: Number
    
})

module.exports = mongoose.model('factura', billSchema);