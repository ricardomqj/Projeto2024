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

router.get('/edit/:email', auth.getUserMail , async (req, res, next) => { 
  const token = req.cookies.token;

  try {
    if(req.user.role === "admin"){
      const email = req.params.email;
      const response = await axios.get(`${apiURL}/users/profile/${email}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });

      const userToEdit = response.data;
      
      const responseUsers = await axios.get(`${apiURL}/users/`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      });

      const users = responseUsers.data;

      const responseCursos = await axios.get(`${apiURL}/cursos`);
      const cursos = responseCursos.data;


      res.render('adminEditPerfile', { userToEdit , users , cursos});
    }
    else{
      res.render("error", {message: "Acesso negado", error: {status: "Não tem permissões para aceder a esta página"}});
    }

  } catch (error) {
    next(error);
  }
} );

router.post('/perfil/:email/update', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { nome, curso, escola, departamento } = req.body;

    const updatedUser = await axios.post(`${apiURL}/users/${userEmail}`, { nome, curso, escola, departamento } , 
    {
      headers: {
        'authorization': `Bearer ${req.cookies.token}`
      }
    });

    if (updatedUser) {
      res.redirect(`/admin`);
    } else {
      res.status(400).send('Erro ao atualizar perfil');
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

router.post(`/users/delete/:id`, async (req, res) => {
  try {

    console.log("AQUI");  
    const userId = req.params.id;
    const deletedUser = await axios.delete(`${apiURL}/users/delete/${userId}`, 
    {
      headers: {
        'authorization': `Bearer ${req.cookies.token}`
      }
    });

    if (deletedUser) {
      res.redirect(`/admin`);
    } else {
      res.render("error", {message: "Erro ao eliminar utilizador", error: {status: "Erro ao eliminar utilizador"}});
    }
  } catch (error) {
    console.error('Erro ao eliminar utilizador:', error);
    res.status(500).send('Erro interno do servidor');
  }
} );

module.exports = router;
