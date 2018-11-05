const express = require('express');
const mongoose = require('mongoose');

const app = express();

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

// ===============================
// Mostrar todas las categorias
// ===============================


app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec(async(err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            let cuantos = await Categoria.count({});
            res.json({
                ok: true,
                cuantos,
                categorias,
            });
        });

});


// ===============================
// Mostrar una categoria por ID
// ===============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada',
                    },
                });
            }
            res.json({
                ok: true,
                categoria,
            });
        });

});


// ===============================
// Crear una categoria 
// ===============================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria
    //req.usuario._id
    let userId = req.usuario._id;
    let objectId = mongoose.Types.ObjectId(userId);
    let descripcion = req.body.descripcion;
    let categoria = new Categoria({
        descripcion,
        usuario: objectId
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    })

});


// ===============================
// Actualizar una categoria 
// ===============================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let update = {
        descripcion: req.body.descripcion,
    }
    Categoria.findByIdAndUpdate(id, update, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // no encontro la categoria con el id que enviaron
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria con el id enviado',
                },
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    })

});


// ===============================
// Borrar una categoria 
// ===============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un administador puede borrar categorias
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // no existe la categoria
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria',
                },
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    })


});
module.exports = app;