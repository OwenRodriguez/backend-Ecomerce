'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3300;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/ventasOnline', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log('Conexion exitosa a la BD');
        app.listen(port, () => {
            console.log('Servidor de express corriendo');
        });
    }).catch(err => {
        console.log('Error al conectarse a la BD', err);
    });
