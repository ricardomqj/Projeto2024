
var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var fs = require('fs')
var multer = require('multer')
var auth = require('../auth/auth');

var upload = multer({dest : 'uploads'})

var axios = require('axios');
const mongoose = require('mongoose');
const { findSourceMap } = require('module');

const apiURL = 'http://backend:3001';

// Página Login 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  console.log("login frontend")
  console.log(req.body)

  axios.post(`${apiURL}/users/login`, req.body)
  .then(r=>{
    res.cookie("token", r.data.token, { maxAge: 3600000 });
    if (r.data.role=="admin") res.redirect("/admin/recursos")
    else res.redirect("/recursos")
  })
  .catch(e=>{
      res.redirect('/?info=wrong')
  }) 
});

// Página Logout

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

// Página Registo

router.get('/registo', function(req, res, next) {
  res.render('registo', { title: 'Registo' });
});

router.post('/registo', async (req, res) => {
  const { nome, email, escola, curso, departamento, cargo,  password} = req.body;

  if(!nome || !email || !escola || !curso || !departamento || !cargo || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  await axios.post(`${apiURL}/users/registo`, req.body);

  res.redirect('/');
});


// perfil do utilizador

router.get('/perfil', auth.getUserMail , function(req, res, next) {
  // Aqui você pode adicionar lógica para buscar dados do usuário do banco de dados, se necessário
  res.render('perfil', {
    title: 'Perfil do Usuário',
    usuario: {
      nome: req.user.nome,
      role: req.user.role,
      email: req.user.email,
      escola: req.user.escola,
      departamento: req.user.departamento,
      curso: req.user.curso,
      cargo: req.user.cargo,
      registro: req.user.registo,
      ultimoAcesso: req.user.ultimoAcessos
    }
  });
});

router.get('/perfil/:email', auth.getUserMail, async (req, res) => {
  res.render('perfilEdit', {
    title: 'Perfil do Usuário',
    user: {
      nome: req.user.nome,
      role: req.user.role,
      email: req.user.email,
      escola: req.user.escola,
      departamento: req.user.departamento,
      curso: req.user.curso,
      cargo: req.user.cargo,
      registro: req.user.registo,
      ultimoAcesso: req.user.ultimoAcessos
    }
  });
});

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
      res.redirect(`/perfil`);
    } else {
      res.status(400).send('Erro ao atualizar perfil');
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Pagina de Noticias

router.get('/noticias',  async  (req, res, next) => {
  const token = req.cookies.token;

  try {
    const response = await axios.get(`http://backend:3001/recursos`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    const noticias = response.data;
  
    res.render('noticias', { noticias });
  } catch (error) {
    next(error);
  }
});

router.get('/fileContent/:name', (req, res) => {
  console.log(__dirname + '/../public/fileStore/' + req.params.name)
  var content = fs.readFileSync(__dirname + '/../public/fileStore/' + req.params.name)
  res.send(content)
})

router.get('/download/:name', (req, res) => {
  console.log(__dirname + '/../public/fileStore/' + req.params.name)
  res.download(__dirname + '/../public/fileStore/' + req.params.name)
})

router.get('/upload', function(req, res, next) {
  try {
    const files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json');
    res.render('upload', { files: files, title: 'Publicar' }); // Adiciona título e passa os arquivos para o template
  } catch (err) {
    console.error('Failed to read dbFiles.json:', err);
    res.render('upload', { files: [], title: 'Publicar' }); // Passa array vazio se houver erro
  }
});


router.post('/files', auth.getUserMail, upload.single('myFile'), (req, res) => {
  console.log("cdir: " + __dirname);
  let oldPath = __dirname + '/../' + req.file.path;
  console.log(oldPath);
  let newPath = __dirname + '/../public/fileStore/' + req.file.originalname;
  console.log("new: " + newPath);

  // Mover o arquivo para a pasta fileStore
  fs.rename(oldPath, newPath, err => {
    if(err) throw err;
  });

  var date = new Date().toISOString().substring(0,19);
  // Leia dbFiles.json ou crie um novo array se não existir
  var files = [];
  try {
    files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json');
  } catch (error) {
    console.error('Failed to read dbFiles.json:', error);
  }

  // Adiciona novos dados do arquivo ao array
  files.push({
    autor : req.user.name,
    date: date,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    titulo: req.body.titulo,
  });

  // Escreve de volta para dbFiles.json
  jsonfile.writeFileSync(__dirname + '/../data/dbFiles.json', files, {spaces: 2});

  const resourceData = {
    escola: req.user.escola,
    departamento: req.user.departamento,
    curso: req.user.curso,
    avaliacao: [],
    date: date,
    nome: req.body.titulo,
    descricao: req.body.descricao,
    tema: req.body.tema,
    ficheiros: [req.file.originalname],
    comentarios: [],
    autor_recurso: req.user.nome,
    autor_cargo: req.user.cargo
  };

  // Get the token from cookies
  const token = req.cookies.token;

  axios.post('http://backend:3001/recursos', resourceData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log('Resource added successfully:', response.data);
      res.redirect('/recursos');
    })
    .catch(error => {
      console.error('Error adding resource:', error);
      res.status(500).send('Erro ao adicionar recurso.');
    });

});


module.exports = router;