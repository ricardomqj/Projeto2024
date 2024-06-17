var express = require('express');
var router = express.Router();
var axios = require('axios');
var auth = require('../auth/auth');

const apiURL = 'http://backend:3001/users';


router.post('/favoritos/:recursoId/adicionar',auth.getUserMail, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const { recursoId } = req.params;
    const email = req.user.email;

    const response = await axios.post(`${apiURL}/favoritos/add`, { recursoId , email }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    res.redirect(`/recursos/${recursoId}`);
  } catch (error) {
    next(error);
  }
});

router.get('/profile/:email', async (req, res) => {
  try {
      const email = req.params.email;
      // Aqui, fazemos uma solicitação ao backend para obter os dados do usuário
      const response = await axios.get(`${apiURL}/profile/${email}`);
      const usuario = response.data;

      // Renderiza a página 'perfilAutor' com os dados do usuário
      res.render('perfilAutor', { usuario: usuario });
  } catch (error) {
      if (error.response && error.response.status === 404) {
          res.status(404).send('Usuário não encontrado');
      } else {
          res.status(500).send('Erro interno do servidor');
      }
  }
});

router.post('/favoritos/:recursoId/remover', auth.getUserMail, async (req, res, next) => {
  try {
    console.log("antes de const token, const recursoId, const email");
    const token = req.cookies.token;
    const { recursoId } = req.params;
    const email = req.user.email;
    console.log("recursoID -> " + recursoId);
    console.log("email -> " + apiURL);
    console.log("antes de const response");
    console.log(`antes de axios.delete(${apiURL}/favoritos/${recursoId}/remove)`);
    const response = await axios.post(`${apiURL}/favoritos/${recursoId}/remove`, { recursoId , email }, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });
    console.log("response -> " + response);
    console.log("antes de res.redirect(`/recursos/${recursoId}`)");

    res.redirect(`/recursos/${recursoId}`);
  } catch (error) {
    console.log("error no delete dos favoritos");
    next(error);
  }
});

router.post(`/alterarCargo/:email/:cargo`,auth.getUserMail, async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      res.redirect(`error` , { error: "Não tem permissões para aceder a esta página"});
      return;
    }

    const token = req.cookies.token;
    const email = req.params.email;
    let cargo  = req.params.cargo;

    if (cargo === "aluno") {
      cargo = "professor";
    } else {
      cargo = "aluno";
    }

    const response = await axios.put(`${apiURL}/${email}/cargo`, { cargo }, {
      headers: {
        'authorization': `Bearer ${token}`
    },

  });
  res.redirect(`/admin/`);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
