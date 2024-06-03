const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecursoSchema = new Schema({
    escola: String,
    departamento: String,
    curso: String,
    avaliacao: [Number],
    nome:{ String},
    descricao: String,
    tema: String,
    ficheiros: [String],
    comentarios: 
        {
            autor: String,
            texto: String,
            data: Date
        }
    ,
    data: Date
}, {versionKey: false});

module.exports = mongoose.model('Recurso', RecursoSchema);
