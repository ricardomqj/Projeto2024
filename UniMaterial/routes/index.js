
var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var fs = require('fs')
var multer = require('multer')

var upload = multer({dest : 'uploads'})

var axios = require('axios');
const mongoose = require('mongoose');

const apiURL = 'http://backend:3001';

// Página Login 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// Página Registo

router.get('/registo', function(req, res, next) {
  res.render('registo', { title: 'Registo' });
});

router.post('/registo', async (req, res) => {
  const { nome, email, role, escola, curso, departamento, cargo } = req.body;

  if(!nome || !email || !role || !escola || !curso || !departamento || !cargo) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newUser = new User({
    nome,
    email,
    role,
    escola,
    curso,
    departamento,
    cargo,
    registo: new Date(),
    ultimoAcesso: new Date()
  });

  const response = await axios.put(`${apiURL}/registo`, newUser);

  res.redirect('/');
});




router.get('/perfil', function(req, res, next) {
  // Aqui você pode adicionar lógica para buscar dados do usuário do banco de dados, se necessário
  res.render('perfil', {
    title: 'Perfil do Usuário',
    usuario: {
      nome: 'Pedro Miguel Costa Azevedo',
      role: 'User',
      email: 'a106955@uminho.pt',
      escola: 'Engenharia',
      departamento: 'Informática',
      cargo: 'Aluno',
      registro: '28/07/2023',
      ultimoAcesso: '20/05/2024'
    }
  });
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


router.post('/files', upload.single('myFile'), (req, res) => {
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
    autor : "Pedro Azevedo",
    date: date,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    titulo: req.body.titulo,
  });

  // Escreve de volta para dbFiles.json
  jsonfile.writeFileSync(__dirname + '/../data/dbFiles.json', files, {spaces: 2});

  res.redirect('/');
});


module.exports = router;