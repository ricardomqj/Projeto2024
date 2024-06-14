var express = require('express');
var router = express.Router();
var axios = require('axios');

const apiURL = 'http://backend:3001/users/token';


module.exports.getUserMail = async function(req, res, next) {
    const token = req.cookies.token;

    try {
        const response = await axios.get(`${apiURL}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        });
        console.log(response.data);
        req.user = response.data;  // Armazene os dados do usuário no objeto de requisição
        next();  // Continue para o próximo middleware ou rota
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
