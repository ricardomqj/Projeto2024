const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CursoSchema = new Schema({
    escola: String,
    departamento: String,
    curso: String
}, { versionKey: false });

module.exports = mongoose.model('Cursos', CursoSchema);