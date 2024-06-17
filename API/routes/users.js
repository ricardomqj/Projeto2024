const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const UserModel = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
var jwt = require('jsonwebtoken');
const auth = require('../auth/auth');

const jwtSecret = 'UMinho';  


// Passport configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

router.get('/', auth.authenticateToken, async (req, res) => {
    try{
        const users = await UserController.list();
        res.json(users); 
    }
    catch(error){
        res.status(404).send('users not found');
    }
});   

router.get('/profile/:email', async (req, res) => {
  try {
      const email = req.params.email;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
          return res.status(404).send('Usuário não encontrado');
      }
      res.json(user); // Retorna os dados do usuário como JSON
  } catch ( error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).send(`Erro interno do servidor: ${error.message}`);
  }
});

router.get('/:email/favs', auth.authenticateToken, async (req, res) => {
  try {
    console.log("estou na API em routes/users.js em users/:email/favs");
    const listaFavs = await UserController.getUserFavoritesByEmail(req.params.email);
    res.json(listaFavs);
  } catch (error) {
    res.status(500).send('Erro ao buscar favoritos');
  }
});

router.get('/token', auth.authenticateToken, function(req, res){
    UserController.findByEmail(req.email).then(user => {
        res.json(user);
    }
    ).catch(error => {
        res.status(404).send('User not found');
    });
});


// Login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log("Login:", user, info);
        if (err) {
            console.error("Login error:", err);
            return res.status(500).json({ message: 'Login error' });
        }
        if (!user) {
            console.log("Login failed:", info);
            return res.status(401).json({ message: 'Login failed' });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token: token, role: user.role});
    })(req, res, next);
});

router.post('/registo', async (req, res) => {
    try {

        UserModel.register(new UserModel({ nome: req.body.nome, email: req.body.email, role: "user", escola: req.body.escola, curso: req.body.curso, departamento: req.body.departamento, cargo: "aluno", registo: new Date(), ultimoAcesso: new Date()}), 
        req.body.password,  
        function(err, user) {
            if (err) {
                res.status(400).send('Failed to create user');
            } else {
                res.status(200).send('User created');
            }
        });
    } catch (error) {
        res.status(400).send('Failed to create user');
    }
});

// Favoritos
router.post('/favoritos/add', auth.authenticateToken, async (req, res) => {
    const { recursoId , email } = req.body;
    try {
      const user = await UserController.findByEmail(email);
      if (!user) {
        return res.status(404).send('Usuário não encontrado');
      }
  
      if (user.favoritos.includes(recursoId)) {
        return res.status(400).send('Recurso já está nos favoritos');
      }
  
      user.favoritos.push(recursoId);
      await user.save();
      res.status(200).send('Recurso adicionado aos favoritos');
    } catch (err) {
      console.error('Erro ao adicionar favorito:', err);
      res.status(500).send('Erro ao adicionar favorito');
    }
  });
  
  router.post('/favoritos/:recursoId/remove', auth.authenticateToken,  async (req, res) => {
    console.log("API/routes/users.js em favoritos/remove");
    const { recursoId , email } = req.body;
    const emailAddr = req.params.email;
    try {
      console.log("emailAddr -> ", emailAddr);
      console.log("email(body) -> " + email);
      const user = await UserController.findByEmail(email);
      if (!user) {
        return res.status(404).send('Usuário não encontrado');
      } else {
        console.log("user encontrado");
      }
      user.favoritos.pull(recursoId);
      await user.save();
      res.status(200).send('Recurso removido dos favoritos');
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      res.status(500).send('Erro ao remover favorito');
    }
  });


router.post('/:email', auth.authenticateToken, UserController.updateByEmail);


router.put('/:email/cargo', auth.authenticateToken, auth.isAdmin, UserController.updateCargoByEmail);

router.delete('/delete/:userId', auth.authenticateToken, auth.isAdmin, UserController.delete);

module.exports = router;