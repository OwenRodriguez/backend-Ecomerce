'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    nombre: String,
    dpi: String,
    email: String,
    password: String,
    role: String
});


module.exports = mongoose.model('usuario', usuarioSchema);