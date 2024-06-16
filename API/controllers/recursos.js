const Recurso = require('../models/recursos');

module.exports.list = async () => {
    return await Recurso.find().exec();
}

module.exports.findByNome = nome => {
    return Recurso.find({ nome: new RegExp(nome, 'i') }).exec(); 
}

module.exports.findByAutor = autor => {
    return Recurso.find({ autor_recurso: new RegExp(autor, 'i') }).exec(); 
}
module.exports.findByTema = tema => {
    return Recurso.find({ tema: new RegExp(tema, 'i') }).exec(); 
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

module.exports.insert = recurso => {
    return Recurso.create(recurso);
}

module.exports.addComment = async (req, res) => {
    try {
        const { recursoId } = req.params;
        const { texto , autor , autor_email } = req.body;

        //console.log(`autor: ${autor}`)

        const recurso = await Recurso.findById(recursoId);
        if (!recurso) {
            return res.status(404).json({ message: 'Recurso não encontrado' });
        }
        
        const novoComentario = {
            autor,
            texto,
            data: new Date(),
            autor_email
        };

        console.log('Documento atual:', recurso);
        console.log('Tipo de "comentarios":', typeof recurso.comentarios);


        recurso.comentarios.push(novoComentario);
        await recurso.save();

        res.status(200).json({ message: 'Comentário adicionado com sucesso', recurso });
    } catch (err) {
        console.error('Erro ao adicionar comentário:', err);
        res.status(500).json({ message: 'Erro ao adicionar comentário' });
    }
};

exports.addEvaluation = async (req, res) => {
    const { recursoId } = req.params;
    const { avaliacao, email } = req.body;

    try {
        // Find the resource by ID
        const recurso = await Recurso.findById(recursoId);

        if (!recurso) {
            return res.status(404).json({ message: 'Recurso não encontrado' });
        }

        // Check if the email has already submitted an evaluation
        const existingEvaluation = recurso.avaliacao.find(eval => eval.email === email);

        if (existingEvaluation) {
            return res.status(409).json({ message: 'Usuário já avaliou este recurso' });
        }

        // Add new evaluation
        const novaAvaliacao = {
            avaliacao,
            email
        };

        recurso.avaliacao.push(novaAvaliacao);
        await recurso.save();

        res.status(201).json({ message: 'Avaliação adicionada com sucesso', recurso });
    } catch (err) {
        console.error('Erro ao adicionar avaliação:', err);
        res.status(500).json({ message: 'Erro ao adicionar avaliação' });
    }
};

module.exports.removeById = id => {
    return Recurso.deleteOne({ _id: id });
}

module.exports.updateById = async (id, recursoData) => {
    const result = await Recurso.updateOne({ _id: id }, recursoData, { new: true });
    return result;
}

exports.deleteResourcesByUserEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        
        console.log('Deleting resources for user:', userEmail);

        // Find and delete resources by autor_email
        const deleteResult = await Recurso.deleteMany({ autor_email: userEmail });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'No resources found for this user' });
        }

        res.json({ message: `${deleteResult.deletedCount} resources deleted successfully` });
    } catch (error) {
        console.error('Error deleting resources:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.updateCommentsByUserEmail = async (req, res) => {
    try {
        const userEmail = req.params.userEmail;

        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required' });
        }

        // Update resources, modifying comments by the specified userEmail
        const updateResult = await Recurso.updateMany(
            { "comentarios.autor_email": userEmail },
            { $set: { "comentarios.$[elem].autor": "(usuário eliminado)" } },
            { arrayFilters: [{ "elem.autor_email": userEmail }] }
        );

        res.json({ message: `${updateResult.modifiedCount} comments updated successfully` });
    } catch (error) {
        console.error('Error updating comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};