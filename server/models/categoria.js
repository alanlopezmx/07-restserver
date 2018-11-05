// nombre: string
// usuario: objectId
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let uniqueValidator = require('mongoose-unique-validator');

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
        unique: true,
    },
    usuario: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'usuario'
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('categoria', categoriaSchema);