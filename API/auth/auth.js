//const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = 'UMinho';

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

module.exports.isAdmin = (req, res, next) => {
    // Assuming your user object (from the decoded token) has a 'role' property
    if (req.email && req.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        res.sendStatus(403); // Forbidden: User is not authorized
    }
};