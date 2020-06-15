'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoriaSchema = Schema({

    nombre: String,
    clase: String,
		producto: [{type: Schema.Types.ObjectId, ref: 'producto'}]
});

module.exports = mongoose.model('categoria', categoriaSchema);