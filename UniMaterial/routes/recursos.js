const express = require('express');
const router = express.Router();
const RecursoController = require('../controllers/recursos');

// List all recursos or find by query parameters
router.get('/', async (req, res) => {
    try {
        if (req.query.nome) {
            const recursos = await RecursoController.findByNome(req.query.nome);
            if (recursos.length === 0) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recursos);
        }
        if (req.query.id) {
            const recurso = await RecursoController.findById(req.query.id);
            if (!recurso) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recurso);
        }   
        if (req.query.escola) {
            const recurso = await RecursoController.findByEscola(req.query.escola);
            if (!recurso) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recurso);
        }
        if (req.query.departamento) {
            const recurso = await RecursoController.findByDepartamento(req.query.departamento);
            if (!recurso) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recurso);
        }
        if (req.query.curso) {
            const recurso = await RecursoController.findByCurso(req.query.curso);
            if (!recurso) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recurso);
        }
        if (req.query.tema) {
            const recurso = await RecursoController.findByTema(req.query.tema);
            if (!recurso) return res.status(404).json({ message: 'Recurso not found' });
            return res.status(200).json(recurso);
        }
        
        const recursos = await RecursoController.list();
        res.render('recursosTab', { recursos }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const recurso = await RecursoController.findById(req.params.id);
        if(recurso) {
            res.render('recursoPage', { recurso });  
        } else {
            res.status(404).send('Recurso not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Insert a new recurso
router.post('/', async (req, res) => {
    try {
        const novoRecurso = await RecursoController.insert(req.body);
        res.status(201).json(novoRecurso);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove recurso by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await RecursoController.removeById(req.params.id);
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Recurso not found' });
        res.status(200).json({ message: 'Recurso deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update recurso by nome
router.put('/:nome', async (req, res) => {
    try {
        const recursoAtualizado = await RecursoController.updateByName(req.params.nome, req.body);
        if (recursoAtualizado.nModified === 0) return res.status(404).json({ message: 'Recurso not found or no changes made' });
        res.status(200).json({ message: 'Recurso updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;