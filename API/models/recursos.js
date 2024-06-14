const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComentarioSchema = new Schema({
    autor: String,
    texto: String,
    data: Date
}, { _id: false }); 

const AvaliacaoSchema = new Schema({
    avaliacao: Number,
    email: String
}, { _id: false });

const RecursoSchema = new Schema({
    restricao: String,
    escola: String,
    departamento: String,
    curso: String,
    avaliacao: [AvaliacaoSchema],
    nome: String,
    descricao: String,
    tema: String,
    ficheiros: [String],
    comentarios: [ComentarioSchema], 
    data: Date,
    autor_recurso: String,
    autor_cargo: String,
    autor_email: String,
}, { versionKey: false });

module.exports = mongoose.model('Recurso', RecursoSchema);
