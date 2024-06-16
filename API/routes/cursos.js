const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos');
const auth = require('../auth/auth');

router.get('/', cursosController.findAll);

router.get('/:id', cursosController.findOne);

router.post('/', auth.authenticateToken, auth.isAdmin, cursosController.create);

router.delete('/:cursoNome', auth.authenticateToken, auth.isAdmin, cursosController.delete);



module.exports = router;
