const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const _ = require('underscore');


let app = express();
let Producto = require('../models/producto');



// ===================================================
// Obtener productos
// ===================================================

app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos
    //populate: Usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = new Number(desde);

    let limite = Number(req.query.limite || 5);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('categoria')
        .populate('usuario', 'nombre email')
        .exec(async(err, productos) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err,
                })
            }
            let cuantos = await Producto.count({});
            res.json({
                ok: true,
                cuantos,
                productos
            })
        })

});

// ===================================================
// Obtener producto por id
// ===================================================

app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: Usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró el id',
                    },
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
            });
        });

});


// ===================================================
// Buscar productos
// ===================================================


app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                })
            }
            res.json({
                ok: true,
                productos
            });
        });
})

// ===================================================
// Crear un nuevo producto
// ===================================================

app.post('/producto', verificaToken, (req, res) => {
    //Grabar el usuario
    // Grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB,
        });
    })


});

// ===================================================
// Acutalizar producto
// ===================================================

app.put('/producto/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el id',
                },
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

// ===================================================
// eliminar producto
// ===================================================

app.delete('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el id',
                },
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});



module.exports = app;