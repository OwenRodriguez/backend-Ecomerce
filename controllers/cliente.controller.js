'use strict'

var Carrito = require('../models/carrito.model');
var Usuario = require('../models/usuario.model');
var Producto = require('../models/producto.model');
var Categoria = require('../models/categoria.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function loginUsuario(req, res) {
    var params = req.body;

    if (params.email) {
        if (params.password) {
            Usuario.findOne({ $or: [{ email: params.email }] }, (err, usuarioFind) => {
                if (err) {
                    res.status(500).send({ message: 'Error in the server' });
                } else if (usuarioFind) {
                    bcrypt.compare(params.password, usuarioFind.password, (err, checkPassword) => {
                        if (err) {
                            res.status(500).send({ message: 'Error al comparar contraseñas' });
                        } else if (checkPassword) {
                            if (params.gettoken) {
                                res.send({ token: jwt.createToken(usuarioFind) })
                            } else {
                                res.send({ usuario: empresaFind });
                            }
                        } else {
                            res.status(418).send({ message: 'Contraseña incorrecta' });
                        }
                    });
                } else {
                    res.send({ message: 'Usuario no encontrado' });
                }
            });
        } else {
            res.send({ message: 'Por favor ingresa la contraseña' });
        }
    } else {
        res.send({ message: 'Ingresa el email' });
    }
}

//Gestion de Clientes

function saveCliente(req, res) {
    var cliente = new Usuario();
    var params = req.body;

    if (
        params.nombre &&
        params.dpi &&
        params.email &&
        params.password) {

        Usuario.findOne({
            $or: [{ dpi: params.dpi },
            { email: params.email }]
        }, (err, usuarioFind) => {
            if (err) {
                res.status(500).send({ message: 'Error in the server' });
            } else if (usuarioFind) {
                res.status(200).send({ message: 'Dpi o correo ya registrado, intente con otro' });
            } else {
                cliente.nombre = params.nombre;
                cliente.dpi = params.dpi;
                cliente.email = params.email;
                cliente.role = 'CLIENTE';
                bcrypt.hash(params.password, null, null, (err, hashPassword) => {
                    if (err) {
                        res.status(500).send({ message: 'Error de encriptación' })
                    } else {
                        cliente.password = hashPassword;
                        cliente.save((err, clienteSaved) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (clienteSaved) {
                                res.status(200).send({ cliente: clienteSaved });
                            } else {
                                res.status(418).send({ message: 'Error al registrar cliente' });
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(200).send({ message: 'Por favor ingresa todos los datos' });
    }
}


function deleteCliente(req, res) {
    var clienteId = req.params.id;

    Usuario.findByIdAndRemove(clienteId, (err, clienteDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (clienteDeleted) {
            res.status(200).send({ message: 'Cliente eliminado', clienteDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}

function updateCliente(req, res) {
    var clienteId = req.params.id;
    var update = req.body;

    Usuario.findByIdAndUpdate(clienteId, update, { new: true }, (err, usuarioUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (usuarioUpdated) {
            res.status(200).send({ cliente_actualizado: usuarioUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}



//******************************************************** */

function busquedaProductos(req, res) {
    var data = req.body.search;

    Producto.find({
        $or: [{ marca: { $regex: data, $options: 'i' } },
        { presentacion: { $regex: data, $options: 'i' } }]
    }, (err, productFind) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productFind) {
            res.status(200).send(productFind);
        } else {
            res.status(200).send({ message: 'Coincidencia no valida' });
        }
    });
}


function listCategoria(req, res) {
    Categoria.find({}).exec((err, categorias) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (categorias) {
            res.status(200).send({ todas_las_categorias: categorias });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}

// Carrito

function saveCarrito(req, res) {
    var dates = req.body
    var carrito = new Carrito(); //Instancia del modelo de Carrito de compras

    if (dates.idCliente) {
        Carrito.findOne({ cliente: dates.idCliente }, (err, carritoFound) => {
            if (err) {
                res.status(500).send({ message: 'Error in the server' });
            } else if (carritoFound) {
                res.send({ message: 'Este cliente ya cuenta con carrito' });
            } else {
                carrito.cliente = dates.idCliente
                carrito.save((err, carritoSaved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al realizar la peticion' });
                    } else if (carritoSaved) {
                        res.send({ message: 'Carrito de compras generado correctamente' });
                    } else {
                        res.status(404).send({ message: 'No se ha podido registrar el corrito de compras' });
                    }
                })
            }
        });
    } else {
        res.status(404).send({ message: 'Debe ingresar los datos necesarios' });
    }
}


function addProduct(req, res) {
    var idShcr = req.params.idShcr; 
    var dates = req.body;
    var mas = Number;
    var prueba = String;
    var cantidad = Number;
    var sub1 = Number;
    var sub2 = Number;

    if (dates.nombreProducto) {
        Producto.findOne({ nombreProducto: dates.nombreProducto }, (err, productFound) => {
            if (err) {
                res.status(500).send({ message: 'Error in the server' });
            } else if (productFound) {
                Carrito.findOne({ _id: idShcr, compra: { $elemMatch: { nombreProducto: dates.nombreProducto } } }, { 'compra.$': 1 }, (err, shcrF) => {
                    if (err) {
                        res.status(500).send({ message: 'Error in the server' });
                    } else if (shcrF) {
                        prueba = shcrF.compra[0].nombreProducto;
                        cantidad = shcrF.compra[0].cantidad;
                        parseInt(prueba);
                        parseInt(cantidad);
                        mas = parseInt(cantidad) + parseInt(dates.quantity);
                        Number(mas)
                        parseInt(mas);
                        console.log(mas)
                        console.log(cantidad);
                        console.log(prueba);
                        console.log(cantidad + parseInt(dates.cantidad));
                        Carrito.findOneAndUpdate({ _id: idShcr, 'compra.nombreProducto': dates.nombreProducto }, { 'compra.$.cantidad': parseInt(cantidad) + parseInt(dates.cantidad) }, { new: true }, (err, qUpdated) => {
                            if (err) {
                                res.status(500).send({ message: 'Error al realizar la peticion, intente de nuevo' });
                            } else if (qUpdated) {
                                res.send({ message: 'Productos agregados al carrito de compras', qUpdated });
                            } else {
                                res.status(404).send({ message: 'Productos agregados al carrito de compras', shcrUpdated });
                            }
                        })
                    } else {
                        Carrito.findByIdAndUpdate(idShcr, { $push: { compra: { nombreProducto: dates.nombreProducto, cantidad: dates.cantidad, precio: dates.precio, subtotal: parseInt(dates.cantidad) * parseInt(dates.precio)  } } }, { new: true }, (err, shcrUpdated) => {
                            if (err) {
                                res.status(500).send({ message: 'Error in the server' });
                            } else if (shcrUpdated) {
                                res.send({ message: 'Productos agregados al carrito de compras', shcrUpdated });
                            } else {
                                res.status(404).send({ message: 'No se han podido agregar los productos' });
                            }
                        });
                    }
                })
            } else {
                res.status(404).send({ message: 'Error al buscar el producto' });
            }
        })
    } else {
        res.status(404).send({ message: 'Debe ingresar todos los datos' });
    }
}

function listCarrito(req, res) {
    Carrito.find({}.exec, (err, shcrList) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (shcrList) {
            res.send({ message: 'Listado de Carritos de Compras', shcrList });
        } else {
            res.status(404).send({ message: 'No se han podido listar los registros' });
        }
    }).populate('usuario');
}




module.exports = {
    loginUsuario,
    saveCliente,
    deleteCliente,
    updateCliente,
    busquedaProductos,
    listCategoria,
    //carrito
    saveCarrito,
    addProduct,
    listCarrito
}
