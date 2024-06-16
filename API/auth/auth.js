//const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = 'UMinho';
const User = require('../models/users');

module.exports.authenticateToken = (req, res, next) => {
    //console.log(req.headers['authorization']); // Deve mostrar o cabeçalho completo de autorização
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Sem token, não autorizado

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido ou expirado
        req.email = user.email;
        req.role = user.role;
        //console.log(user);
        next(); // prossegue para a próxima middleware ou rota
    });
}

module.exports.isAdmin = async (req, res, next) => {

    const user =  await User.findOne({ email: req.email });

    if (user.role === 'admin') { 
        next(); 
    } else {
        res.sendStatus(403); 
    }
};