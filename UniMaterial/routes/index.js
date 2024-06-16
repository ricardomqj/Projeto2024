
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
    res.redirect("/recursos")
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

router.get('/registo', async function(req, res, next) {
  try {
    const response = await axios.get(`${apiURL}/cursos`);
    const cursos = response.data;
    res.render('registo', { title: 'Registo', cursos: cursos });
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).render('error', { error: error });
  }
});

router.post('/registo', async (req, res) => {
  const { nome, email, escola, curso, departamento, password} = req.body;

  if(!nome || !email || !escola || !curso || !departamento || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  await axios.post(`${apiURL}/users/registo`, req.body);

  res.redirect('/');
});


// perfil do utilizador

router.get('/perfil', auth.getUserMail , function(req, res, next) {
  const admin = req.user.role === "admin";
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
      ultimoAcesso: req.user.ultimoAcessos,
    },
    admin
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

router.get('/noticias', auth.getUserMail,  async  (req, res, next) => {
  const token = req.cookies.token;

  try {
    const response = await axios.get(`http://backend:3001/recursos`, {
      headers: {
        'authorization': `Bearer ${token}`
      }
    });

    const noticias = response.data;

    const admin = req.user.role === "admin";
    res.render('noticias', { noticias , admin });
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

router.get('/upload', auth.getUserMail, function(req, res, next) {
  try {
    const files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json');
    const admin = req.user.role === "admin";
    res.render('upload', { files: files, title: 'Publicar', admin }); // Adiciona título e passa os arquivos para o template
  } catch (err) {
    console.error('Failed to read dbFiles.json:', err);
    res.render('upload', { files: [], title: 'Publicar' }); // Passa array vazio se houver erro
  }
});


router.post('/files', auth.getUserMail, upload.array('myFiles', 10), (req, res) => {
  var filesData = [];  // Armazena os metadados de todos os arquivos
  var resourceFiles = [];  // Armazena os nomes dos arquivos para o recurso

  req.files.forEach(file => {
    console.log("cdir: " + __dirname);
    let oldPath = __dirname + '/../' + file.path;
    console.log("old path: " + oldPath);
    let newPath = __dirname + '/../public/fileStore/' + file.originalname;
    console.log("new path: " + newPath);

    // Mover o arquivo para a pasta fileStore
    fs.rename(oldPath, newPath, err => {
      if(err) throw err;
    });

    var date = new Date().toISOString().substring(0,19);
    // Adiciona os metadados do arquivo ao array
    filesData.push({
      autor : req.user.name,
      date: date,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      titulo: req.body.titulo,
    });
    resourceFiles.push(file.originalname);
  });

  // Leia dbFiles.json ou crie um novo array se não existir
  try {
    var files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json');
  } catch (error) {
    console.error('Failed to read dbFiles.json:', error);
    var files = [];
  }
  
  // Concatena os novos dados de arquivo com os existentes
  files = files.concat(filesData);
  // Escreve de volta para dbFiles.json
  jsonfile.writeFileSync(__dirname + '/../data/dbFiles.json', files, {spaces: 2});

  const resourceData = {
    restricao: req.body.privacidade,
    escola: req.user.escola,
    departamento: req.user.departamento,
    curso: req.user.curso,
    avaliacao: [],
    date: new Date().toISOString().substring(0,19),
    nome: req.body.titulo,
    descricao: req.body.descricao,
    tema: req.body.tema,
    ficheiros: resourceFiles,
    comentarios: [],
    autor_recurso: req.user.nome,
    autor_cargo: req.user.cargo,
    autor_email: req.user.email
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