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
      const recursosPreFilt = response.data;
      
      console.log(req.user.role);

      if(req.user.role === "admin"){
        const recursos = recursosPreFilt
         res.render('recursosTabAdmin', { recursos });
      }
      else {
        const recursos = recursosPreFilt.filter(recurso => {
          switch (recurso.restricao) {
            case 'público':
              return true; // Public resources are visible to everyone
            case 'escola':
              return recurso.escola === req.user.escola; // Only visible to users from the same school
            case 'departamento':
              return recurso.departamento === req.user.departamento; // Only visible to users from the same department
            case 'curso':
              return recurso.curso === req.user.curso; // Only visible to users from the same course
            default:
              return false; // In case of an undefined restriction, do not show the resource
        }});

        res.render('recursosTab', { recursos });
      }
    }
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

      res.render('recursoPageEdit', {
        recurso,
        jaAvaliou,
        autorRec,
        usuario: req.user
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

    res.render('recursoPage', {
      recurso,
      jaAvaliou,
      autorRec,
      usuario: req.user
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

    console.log(`recursoId: ${recursoId}`)

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
