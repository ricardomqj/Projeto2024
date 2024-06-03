var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var fs = require('fs')
var multer = require('multer')

var upload = multer({dest : 'uploads'})

/* GET home page. */
router.get('/', function(req, res, next) {
  var date = new Date().toISOString().substring(0,19)
  jsonfile.readFile(__dirname + '/../data/dbFiles.json', (err, fileList) => {
    if(err) {
      res.render('error', {error : err})
    } else {
      res.render('index', {files : fileList, d : date})
    }
  })
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

router.post('/files', upload.single('myFile'), (req, res) => {
  console.log("cdir: " + __dirname);
  let oldPath = __dirname + '/../' + req.file.path
  console.log(oldPath) 
  let newPath = __dirname + '/../public/fileStore/' + req.file.originalname
  console.log("new: " + newPath)

  fs.rename(oldPath, newPath, err => {
    if(err) throw err
  })

  var date = new Date().toISOString().substring(0,19)
  var files = jsonfile.readFileSync(__dirname + '/../data/dbFiles.json')
  files.push({
    date: date,
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  })

  jsonfile.writeFileSync(__dirname + '/../data/dbFiles.json', files)

  res.redirect('/')
})

module.exports = router;