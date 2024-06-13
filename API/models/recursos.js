const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComentarioSchema = new Schema({
    autor: String,
    texto: String,
    data: Date
}, { _id: false }); 

const RecursoSchema = new Schema({
    escola: String,
    departamento: String,
    curso: String,
    avaliacao: [Number],
    nome: String,
    descricao: String,
    tema: String,
    ficheiros: [String],
    comentarios: [ComentarioSchema], 
    data: Date,
    autor_recurso: String,
    autor_cargo: String
}, { versionKey: false });

module.exports = mongoose.model('Recurso', RecursoSchema);
