const Recurso = require('../models/recursos');

module.exports.list = async () => {
    return await Recurso.find().exec();
}

module.exports.findByNome = nome => {
    return Recurso.find({ nome: nome }).exec();
}

module.exports.findByAutor = autor => {
    return Recurso.find({ autor_recurso: autor }).exec();
}

module.exports.findById = id => {
    return Recurso.findOne({ _id: id }).exec();
}

module.exports.findByEscola = escola => {
    return Recurso.find({ escola: escola }).exec();
}

module.exports.findByDepartamento = departamento => {
    return Recurso.find({ departamento: departamento }).exec();
}

module.exports.findByCurso = curso => {
    return Recurso.find({ curso: curso }).exec();
}

module.exports.findByTema = tema => {
    return Recurso.find({ tema: tema }).exec();
}

module.exports.insert = recurso => {
    return Recurso.create(recurso);
}

module.exports.removeById = id => {
    return Recurso.deleteOne({ id: id });
}

module.exports.updateByName = async (nome, recursoData) => {
    const result = await Recurso.updateOne({ nome: nome }, recursoData, { new: true });
    return result;
}
