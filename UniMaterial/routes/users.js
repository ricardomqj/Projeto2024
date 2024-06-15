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

module.exports = router;
