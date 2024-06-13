var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURLRecurs = 'http://backend:3001/recursos';

// É PRECISO FAZER FUNÇÃO PARA VERIFICAR SE O UTILIZADOR É ADMIN EM TODAS AQUI E METER COMO MIDELWARE


router.get('/recursos', auth.getUserMail , async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (req.query.autor) {
      const response = await axios.get(`${apiURLRecurs}?autor=${req.query.autor}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      const recursos = response.data;


      res.render('recursosTab', { recursos });
    } 
  
    else {
        const response = await axios.get(apiURLRecurs, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
        const recursos = response.data;
      
        console.log(req.user.role);

        res.render('recursosTabAdmin', { recursos });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    console.log(`${apiURLRecurs}?id=${req.params.id}`);
    const response = await axios.get(`${apiURLRecurs}?id=${req.params.id}`);
    const recurso = response.data;
    res.render('recursoPage', { recurso });
  } catch (error) {
    next(error);
  }
});

module.exports = router;