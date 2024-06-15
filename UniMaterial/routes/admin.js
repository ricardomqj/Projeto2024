var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURL = 'http://backend:3001';

// É PRECISO FAZER FUNÇÃO PARA VERIFICAR SE O UTILIZADOR É ADMIN EM TODAS AQUI E METER COMO MIDELWARE

router.get('/', auth.getUserMail , async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if(req.user.role === "admin"){
      const response = await axios.get(`${apiURL}/users/`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });

      const users = response.data;

      const admin = req.user.role === "admin";

      res.render('adminPainel', { users , admin });
    }
    else{
      res.render("error", {message: "Acesso negado", error: {status: "Não tem permissões para aceder a esta página"}});
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
