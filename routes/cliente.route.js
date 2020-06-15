'use strict'

var clienteController = require('../controllers/cliente.controller');


var express = require('express');
var api = express.Router();
//var middlewareAuth = require('../middlewares/authenticated');

//URI's Cliente
api.post('/saveCliente', clienteController.saveCliente);
api.delete('/deleteCliente/:id', clienteController.deleteCliente);
api.put('/updateCliente/:id', clienteController.updateCliente);
api.get('/busquedaProductos', clienteController.busquedaProductos);
api.get('/listCategoria', clienteController.listCategoria);

//carrito
api.post('/saveCarrito', clienteController.saveCarrito);
api.put('/addProduct/:idShcr', clienteController.addProduct);
api.get('/listCarrito', clienteController.listCarrito);





module.exports = api;