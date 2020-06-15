'use strict'

var administradorController = require('../controllers/administrador.controller');


var express = require('express');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/login', administradorController.login);

//URI's Usuarios
api.post('/saveUsuario', administradorController.saveUsuario);
api.put('/updateUsuario/:id', middlewareAuth.ensureAuth, administradorController.updateUsuario);
api.delete('/deleteUsuario/:id', middlewareAuth.ensureAuth, administradorController.deleteUsuario);
api.get('/listUsuarios', middlewareAuth.ensureAuth, administradorController.listUsuarios);

//URI's Productos

api.post('/saveProducto', middlewareAuth.ensureAuthAdmin, administradorController.saveProducto);
api.put('/updateProducto/:id', middlewareAuth.ensureAuth, administradorController.updateProducto);
api.delete('/deleteProducto/:id',middlewareAuth.ensureAuth, administradorController.deleteProducto);
api.get('/listProducto',middlewareAuth.ensureAuth, administradorController.listProducto);
api.get('/controlStock', middlewareAuth.ensureAuth, administradorController.controlStock);
api.get('/buscarProductos', middlewareAuth.ensureAuth, administradorController.buscarProductos);
api.get('/mostSale' ,middlewareAuth.ensureAuth, administradorController.mostSale);
api.get('/productosAgotados' , middlewareAuth.ensureAuth, administradorController.productosAgotados);


//URI's categorias

api.post('/saveCategoria', administradorController.saveCategoria);
api.get('/listCategoria', administradorController.listCategoria);
api.put('/updateCategoria/:id', administradorController.updateCategoria);
api.delete('/deleteCategoria/:id', administradorController.deleteCategoria);
        //Set de Producto en una categoria
api.post('/setProducto/:id', administradorController.setProducto);
        //Remove de Producto en una categoria

        //categoria por defecto
api.delete('/deleteCategory', middlewareAuth.ensureAuth, administradorController.deleteCategory);


//Uri's Facturas
api.post('/addFactura/:idCarrito', middlewareAuth.ensureAuth, administradorController.addFactura);
api.post('/findFacturaCliente', middlewareAuth.ensureAuth, administradorController.findFacturaCliente);
api.get('/listFactura', middlewareAuth.ensureAuth, administradorController.listFactura);

module.exports = api;