var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURL = 'http://backend:3001/recursos';

// Rota principal
router.get('/', auth.getUserMail, async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (req.query.autor) {
      const response = await axios.get(`${apiURL}?autor=${req.query.autor}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      const recursos = response.data;


      res.render('recursosTab', { recursos });
    } 
  
    else {
      const response = await axios.get(apiURL, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });
      const recursos = response.data;
      
      console.log(req.user.role);

      if(req.user.role === "admin"){
         res.render('recursosTabAdmin', { recursos });
      }
      else {
        res.render('recursosTab', { recursos });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth.getUserMail, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`${apiURL}?id=${req.params.id}`);
    const response = await axios.get(`${apiURL}?id=${req.params.id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    const recurso = response.data;

    const jaAvaliou = recurso.avaliacao.some(avaliacao => avaliacao.email === req.user.email);

    res.render('recursoPage', {
      recurso,
      jaAvaliou,
      usuario: req.user
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:recursoId/comentarios',auth.getUserMail, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const { recursoId } = req.params;
    const { texto } = req.body;
    const  autor  = req.user.nome;

    console.log(`autor: ${autor}`)

    const response = await axios.post(`${apiURL}/${recursoId}/comentarios`, { texto , autor }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    res.redirect(`/recursos/${recursoId}`);
  } catch (error) {
    next(error);
  }

});

router.post('/:recursoId/avaliar', auth.getUserMail, async (req, res) => {
  const token = req.cookies.token;
  const { recursoId } = req.params;
  const { avaliacao } = req.body;
  const email = req.user.email;

  try {
    const response = await axios.post(`${apiURL}/${recursoId}/avaliar`, { avaliacao , email }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    res.redirect(`/recursos/${recursoId}`);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).send('Failed to submit evaluation.');
  }
});




module.exports = router;
