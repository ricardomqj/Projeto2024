const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos');
const auth = require('../auth/auth');

router.get('/', cursosController.findAll);

router.get('/:id', cursosController.findOne);

router.post('/', auth.authenticateToken, cursosController.create);

router.put('/:id', auth.authenticateToken, cursosController.update);

router.delete('/:id', auth.authenticateToken, cursosController.delete);

module.exports = router;
