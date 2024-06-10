var express = require('express');
var router = express.Router();
var axios = require('axios');

const apiURL = 'http://backend:3001/recursos';

// Rota principal
router.get('/', async (req, res, next) => {
  try {
    const response = await axios.get(apiURL);
    const recursos = response.data;
    res.render('recursosTab', { recursos }); 
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    console.log(`${apiURL}?id=${req.params.id}`);
    const response = await axios.get(`${apiURL}?id=${req.params.id}`);
    const recurso = response.data;
    res.render('recursoPage', { recurso });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
