var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURL = 'http://backend:3001/recursos';


// Rota principal
router.get('/', auth.getUserMail, async (req, res, next) => {
  const token = req.cookies.token;
  try {
    // Monta a query string baseada nos filtros fornecidos
    let query = [];
    if(req.query.sort) {
      query.push(`sort=${encodeURIComponent(req.query.sort)}`);
    }
    if (req.query.autor) {
      query.push(`autor=${encodeURIComponent(req.query.autor)}`);
    }
    if (req.query.nome) {
      query.push(`nome=${encodeURIComponent(req.query.nome)}`);
    }
    if (req.query.tema) {
      query.push(`tema=${encodeURIComponent(req.query.tema)}`);
    }
    const queryString = query.length ? `?${query.join('&')}` : '';
    const response = await axios.get(`${apiURL}${queryString}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    const recursos = response.data;

    const admin = req.user.role === "admin";
    
    res.render('recursosTab', { recursos , admin });
    
  } catch (error) {
    next(error);
  }
});

router.get('/:id/editar', auth.getUserMail, async (req, res, next) => {
  try{
    const token = req.cookies.token;
    const response = await axios.get(`${apiURL}?id=${req.params.id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    const recurso = response.data;

      const jaAvaliou = recurso.avaliacao.some(avaliacao => avaliacao.email === req.user.email);

      
      const autorRec = recurso.autor_email === req.user.email;
      const admin = req.user.role === "admin";

      res.render('recursoPageEdit', {
        recurso,
        jaAvaliou,
        autorRec,
        usuario: req.user,
        admin
      });
  } catch (error) {
    next(error);
  }

});


router.get('/:id', auth.getUserMail, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    //console.log(`${apiURL}?id=${req.params.id}`);
    const response = await axios.get(`${apiURL}?id=${req.params.id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    const recurso = response.data;

    const jaAvaliou = recurso.avaliacao.some(avaliacao => avaliacao.email === req.user.email);

    
    const autorRec = recurso.autor_email === req.user.email;
    const admin = req.user.role === "admin";

    res.render('recursoPage', {
      recurso,
      jaAvaliou,
      autorRec,
      usuario: req.user,
      admin
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:recursoId/comentarios',auth.getUserMail, async (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(401).send('Usuário não autenticado ou e-mail não disponível');
  }
  
  try {
    const token = req.cookies.token;
    const { recursoId } = req.params;
    const { texto } = req.body;
    const  autor  = req.user.nome;
    const autor_email = req.user.email;

    console.log(`recursoId: ${recursoId}`)

    console.log(`autor: ${autor}`)

    const response = await axios.post(`${apiURL}/${recursoId}/comentarios`, { texto , autor , autor_email }, {
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
  const { recursoId } = req.params.recursoId;
  const { avaliacao } = req.body;
  const email = req.user.email;

  console.log(`recursoId: ${recursoId}`)

  try {
    const response = await axios.post(`${apiURL}/${req.params.recursoId}/avaliar`, { avaliacao , email }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    res.redirect(`/recursos/${req.params.recursoId}`);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).send('Failed to submit evaluation.');
  }
});

router.post('/:recursoId/update', async (req, res) => {
  try {
    const token = req.cookies.token;
    const { recursoId } = req.params;

    const updatedRecurso = await axios.post(`${apiURL}/${recursoId}/update`, req.body, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    if (updatedRecurso) {
      res.redirect(`/recursos/${recursoId}`);
    } else {
      res.status(400).send('Erro ao atualizar recurso');
    }
  } catch (error) {
    console.error('Erro ao atualizar recurso:', error);
    res.status(500).send('Erro interno do servidor');
  }
});



router.get('/:id/DELETE', async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const response = await axios.delete(`${apiURL}/${req.params.id}/DELETE`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    res.redirect('/recursos');
  } catch (error) {
    next(error);
  }
});



module.exports = router;
