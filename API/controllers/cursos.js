const Cursos = require('../models/cursos'); 

// Adicionar um novo curso
exports.create = async (req, res) => {
    try {
        const novoCurso = new Cursos(req.body);
        const cursoSalvo = await novoCurso.save();
        res.status(201).send(cursoSalvo);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Recuperar todos os cursos
exports.findAll = async (req, res) => {
    try {
        const cursos = await Cursos.find();
        res.status(200).send(cursos);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Recuperar um único curso pelo ID
exports.findOne = async (req, res) => {
    try {
        const curso = await Cursos.findById(req.params.id);
        if (!curso) {
            res.status(404).send({ message: 'Curso não encontrado!' });
        } else {
            res.status(200).send(curso);
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

// Atualizar um curso pelo ID
exports.update = async (req, res) => {
    try {
        const cursoAtualizado = await Cursos.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cursoAtualizado) {
            res.status(404).send({ message: 'Curso não encontrado!' });
        } else {
            res.status(200).send(cursoAtualizado);
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

// Excluir um curso pelo ID
exports.delete = async (req, res) => {
    try {
        const curso = await Cursos.findByIdAndDelete(req.params.id);
        if (!curso) {
            res.status(404).send({ message: 'Curso não encontrado!' });
        } else {
            res.status(200).send({ message: 'Curso excluído com sucesso!' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};
