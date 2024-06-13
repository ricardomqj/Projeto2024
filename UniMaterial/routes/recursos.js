var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURL = 'http://backend:3001/recursos';

// Rota principal
router.get('/', auth.getUserMail , async (req, res, next) => {
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

router.get('/:id', async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(`${apiURL}?id=${req.params.id}`);
    const response = await axios.get(`${apiURL}?id=${req.params.id}`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    const recurso = response.data;
    res.render('recursoPage', { recurso });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
