'use strict'

var Producto = require('../models/producto.model');
var Categoria = require('../models/categoria.model');
var Usuario = require('../models/usuario.model');
var Carrito = require('../models/carrito.model');
var Factura = require('../models/factura.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function login(req, res) {
    var params = req.body;

    if (params.email) {
        if(params.password){
            Usuario.findOne({$or:[{email: params.email}]}, (err, usuarioFind)=>{
                if(err){
                    res.status(500).send({message:'Error in the server'});
                }else if(usuarioFind){
                    bcrypt.compare(params.password, usuarioFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al comparar contraseñas'});
                        }else if (checkPassword){
                            if(params.gettoken){
                                res.send({token:jwt.createToken(usuarioFind)})
                            }else{
                                res.send({usuario: usuarioFind});
                            }
                        }else{
                            res.status(418).send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Usuario no encontrado'});
                }
            });
        }else{
            res.send({message: 'Por favor ingresa la contraseña'});
        }
    }else{
        res.send({message: 'Ingresa el email'});
    }
}

                                                    //Gestión de usuarios

function saveUsuario(req, res) {
    var usuario = new Usuario();
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
                usuario.nombre = params.nombre;
                usuario.dpi = params.dpi;
                usuario.email = params.email;
                usuario.role = 'ADMIN';
                bcrypt.hash(params.password, null, null, (err, hashPassword) => {
                    if (err) {
                        res.status(500).send({ message: 'Error de encriptación' })
                    } else {
                        usuario.password = hashPassword;
                        usuario.save((err, usuarioSaved) => {
                            if (err) {
                                res.status(500).send({ message: 'Error en el servidor' });
                            } else if (usuarioSaved) {
                                res.status(200).send({ usuario: usuarioSaved });
                            } else {
                                res.status(418).send({ message: 'Error al registrar usuario'});
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

function updateUsuario(req, res) {
    var usuarioId = req.params.id;
    var update = req.body;

    Usuario.findByIdAndUpdate(usuarioId, update, { new: true }, (err, usuarioUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (usuarioUpdated) {
            res.status(200).send({ usuario_actualizado: usuarioUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}

function deleteUsuario(req, res) {
    var usuarioId = req.params.id;

    Usuario.findByIdAndRemove(usuarioId, (err, usuarioDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (usuarioDeleted) {
            res.status(200).send({ message: 'Usuario eliminado', usuarioDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}

function listUsuarios(req, res) {
    Usuario.find({}).exec((err, usuarios) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (usuarios) {
            res.status(200).send({ todos_los_usuarios: usuarios });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}




                                                        //Gestión de productos

function saveProducto(req, res) {
    var producto = new Producto();
    var params = req.body;

    if (params.nombreProducto) {

        Producto.findOne({ $or: [{ nombreProducto: params.nombreProducto }] }, (err, productoFind) => {
            if (err) {
                res.status(500).send({ message: 'Error general en la busqueda' });
            } else if (productoFind) {
                res.send({ message: 'Marca ya registrada, pruebe con otra' });
            } else {
                producto.nombreProducto = params.nombreProducto;
                producto.cantidad = params.cantidad;
                producto.precio = params.precio;
                producto.sale = params.sale;
                producto.save((err, productoSaved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error in the server' });
                    } else if (productoSaved) {
                        res.status(200).send({ producto: productoSaved });
                    } else {
                        res.status(200).send({ message: 'Error al guardar producto' });
                    }
                });
            }
        });
    } else {
        res.status(200).send({ message: 'Por favor ingrese todos los datos' });
    }
}

function updateProducto(req, res) {
    var productoId = req.params.id;
    var update = req.body;

    Producto.findByIdAndUpdate(productoId, update, { new: true }, (err, productoUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productoUpdated) {
            res.status(200).send({ producto_actualizado: productoUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}

function deleteProducto(req, res) {
    var productoId = req.params.id;

    Producto.findByIdAndRemove(productoId, (err, productoDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productoDeleted) {
            res.status(200).send({ message: 'Productos eliminados', productoDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}

function listProducto(req, res) {
    Producto.find({}).exec((err, productos) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productos) {
            res.status(200).send({ todos_los_productos: productos });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}

function controlStock(req, res) {
    Producto.find({}).exec((err, producto) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (producto) {
            res.status(200).send({ control_de_stock: producto.length });
        } else {
            res.status(200).send({ message: 'No hay trbajadores' });
        }
    });
}

function buscarProductos(req, res){
    var data = req.body.search;

    Producto.find({$or:[{nombreProducto:{$regex:data,'$options' : 'i'}},]},(error,productoFind)=>{
        if(error){
            res.status(500).send({message:'Error in the server.'});
         }else if(productoFind){
            res.status(200).send( productoFind);
        }else{
            res.status(200).send({message:'No existe un producto con esos datos'});
        }

    })
}

function mostSale(req, res) {
    Producto.find({},(err, Products)=>{
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (Products) {
            res.send({ Products});
        } else {
            reS.send({ message: 'No se obtuvieron datos' });
        }
    }).sort({sale:-1});
}

function productosAgotados(req, res) {
    Producto.find({ sale: 0 }).populate('categoria').exec((err, soldOut) => {
        if(err) {
            return res.status(500).send({ message: 'Error General'})
        } else {
            return res.status(200).send({ agotados: soldOut})
        }
    })
}



                                            //Gestión de categorías


function saveCategoria(req, res) {
    var categoria = new Categoria();
    var params = req.body;

    if (params.nombre) {

        Categoria.findOne({ $or: [{ nombre: params.nombre }] }, (err, categoriaFind) => {
            if (err) {
                res.status(500).send({ message: 'Error general en la busqueda' });
            } else if (categoriaFind) {
                res.send({ message: 'Nombre ya registrado, pruebe con otra' });
            } else {
                categoria.nombre = params.nombre;
                categoria.clase = params.clase;
                categoria.save((err, categoriaSaved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error in the server' });
                    } else if (categoriaSaved) {
                        res.status(200).send({ categoria: categoriaSaved });
                    } else {
                        res.status(200).send({ message: 'Error al guardar categoria' });
                    }
                });
            }
        });
    } else {
        res.status(200).send({ message: 'Por favor ingrese todos los datos' });
    }
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

function updateCategoria(req, res) {
    var categoriaId = req.params.id;
    var update = req.body;

    Categoria.findByIdAndUpdate(categoriaId, update, { new: true }, (err, categoriaUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (categoriaUpdated) {
            res.status(200).send({ categoria_actualizada: categoriaUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}

function deleteCategoria(req, res) {
    var categoriaId = req.params.id;

    Categoria.findByIdAndRemove(categoriaId, (err, categoriaDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (categoriaDeleted) {
            res.status(200).send({ message: 'Categoria eliminada', categoriaDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}

function setProducto(req, res) {
    var categoriaId = req.params.id;
    var params = req.body;

    if(params.idProducto){
        Categoria.findOne({idProducto: params.idProducto}, (err, categoriaFind)=>{
            if(err){
                res.status(500).send({message: 'Error in the server'});
            }else if(categoriaFind){
                res.send({message: 'Producto ya existente'});
            }else{
                if(params.idProducto){
                    Categoria.findById(categoriaId,(err, categoriaFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error in the server'});
                        }else if(categoriaFind){
                            Categoria.findByIdAndUpdate(categoriaId,{$push: {producto: params.idProducto}},{new: true},(err, categoriaUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error in the server'});
                                }else if(categoriaUpdated){
                                    res.send({categoria: categoriaUpdated});
                                }else{
                                    res.status(418).send({message: 'Error al actualizar'});
                                }
                            }).populate(['producto']);
                        }else{
                            res.status(404).send({message: 'Categoria no encontrada'});
                        }
                    });
                }else{
                    res.send({message: 'Faltan datos'});
                }
            }
        });
    }else{
        res.send({message: 'Faltan datos 2'});
    }
}

function deleteCategory(req, res) {
    const params = req.body
   // if(req.user.rol === 'ADMIN') {
        if(params.id) {
            Categoria.findById(params.id, (err, finded) => {
                if(err) {
                    return res.status(500).send({ message: 'Error general'})
                } else if(!finded) {
                    return res.status(404).send({ message: 'No se ha encontrado'})
                } else if(finded.nombre === 'default') {
                    return res.status(401).send({ message: 'No se puede eliminar la categoria por default.' })
                } else {
                    Categoria.findOne({nombre: 'default'},(err, defaultFinded) => {
                        if(err) {
                            return res.status(500).send({ message: 'Error general'})
                        } else if(!defaultFinded){
                            var categoria = new Categoria()
                            categoria.nombre = 'default'
                            categoria.save((err, saved) => {
                                if(err) {
                                    return res.status(500).send({ message: 'Error general'})
                                } else if(!saved){
                                    return res.status(400).send({ message: 'No se ha podido guardar la default'})
                                } else {
                                    Producto.updateMany({ categoria: params.id }, { categoria: saved._id }, (err, producto) => {
                                        if(err) {
                                            return res.status(500).send({ message: 'Error general'})
                                        } else {
                                            Categoria.findByIdAndDelete(params.id, (err, deleted) => {
                                                if(err) {
                                                    return res.status(500).send({ message: 'Error general'})
                                                } else if(!deleted){
                                                    return res.status(400).send({ message: 'No se ha podido eliminar'})
                                                } else {
                                                    return res.status(200).send({ data: deleted})  
                                                }
                                            })
                                        } 
                                    })
                                }
                            })
                        } else {
                            Producto.updateMany({ categoria: params.id }, { categoria: defaultFinded._id }, (err, producto) => {
                                if(err) {
                                    return res.status(500).send({ message: 'Error general'})
                                } else {
                                    Categoria.findByIdAndDelete(params.id, (err, deleted) => {
                                        if(err) {
                                            return res.status(500).send({ message: 'Error general'})
                                        } else if(!deleted){
                                            return res.status(400).send({ message: 'No se ha podido eliminar'})
                                        } else {
                                            return res.status(200).send({ data: deleted})  
                                        }
                                    })
                                } 
                            })
                        }
                    })
                }
            })
        } else {
            return res.status(400).send({ message: 'Necesita proporcionar un id'})
        }
    //} else {
    //    return res.status(401).send({ message: 'No tiene los permisos necesarios'})
    //}
}


                            //Gestión de facturas

function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function today(){
    var d = new Date();
        var dd = d.getDate();
        var mm = d.getMonth()+1;
        var yyyy = d.getFullYear();
        dd = addZero(dd);
        mm = addZero(mm);
        return dd+'/'+mm+'/'+yyyy;
}

function addFactura(req, res){
    var idCarrito = req.params.idCarrito
    var factura = new Factura();
    var total = 0;
    var dates = req.body;
    var idBill = String;
    var descontar = String;
 //   if(req.user.sub != dates.comprador){
  //      res.status(403).send({message: 'No tiene permisos para esta ruta'});
 //   }else{
        if(dates.confirmarCompra == 'si'){
            if(dates.nit && /* dates.date && */ dates.lugar && dates.comprador){    
                Carrito.findById(idCarrito, (err, found)=>{
                    if(err){
                        console.log(err)
                        res.status(500).send({message: 'Error in the server' });
                    }else if(found){
                        found.compra.forEach(element=>{
                            total = parseInt(total) + parseInt(element.subtotal);
                        })
                        factura.nit = dates.nit
                        factura.fecha = today();
                        factura.lugar = dates.lugar;
                        factura.comprador = dates.comprador;
                        factura.productos = found.compra;
                        factura.total = parseInt(total);

                        factura.save((err, billSaved)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send({message: 'Error in the server 1'});
                            }else if(billSaved){
                                idBill = billSaved.id;
                                res.send({message: 'Factura guardada', billSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido agregar la factura'});
                            }
                        });
                    }else{
                        res.send({message: 'Error'})
                    }
                })
            }else{
                res.status(404).send({message: 'Debe ingresar todos los datos'});
            }
        }else{
            res.send({message: 'Debe confirmar su compra'})
        }
  //  }
}

function findFacturaCliente(req, res){
    var dates = req.body;

 //   if(req.user.role != 'ADMIN'){
 //       res.status(403).send({message: 'No se han podido encontrar las facturas de los usuarios'});
 //   }else{
        Factura.find({comprador: dates.idCliente}, (err, billFound)=>{
            if(err){
                res.status(500).send({message: 'Erro general con la peticion, intente de nuevo'})
            }else if(billFound){   
                res.send({message: 'Facturas del usuario', billFound});
            }else{
                res.status(404).send({message: 'No se han podido encontrar las facturas de los usuarios 1'});
            }
        });
 //   }

}

function listFactura(req, res){
    if(req.user.role != 'ADMIN'){
        res.status(403).send({message: 'No se encontraron facturas de usuarios'});
    }else{
        Factura.find({}.exec, (err, listaFactura)=>{
            if(err){
                res.status(500).send({message: 'Error in the server'});
            }else if(listaFactura){
                res.send({message: 'Facturas ', listaFactura});
            }else{
                res.status(404).send({message: 'NO se han podido listar las facturas'});

            }
        }).populate('comprador')
    }
}





module.exports = {

    login,

    //usuarios

    saveUsuario,
    updateUsuario,
    deleteUsuario,
    listUsuarios,

    //productos

    saveProducto,
    updateProducto,
    deleteProducto,
    listProducto,
    controlStock,
    buscarProductos,
    mostSale,
    productosAgotados,

    //categorias

    saveCategoria,
    listCategoria,
    updateCategoria,
    deleteCategoria,
    setProducto,
    deleteCategory,

    //facturacion

    addFactura,
    findFacturaCliente,
    listFactura
}