var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var recursosRouter = require('./routes/recursos');
var usersRouter = require('./routes/users');
var cursosRouter = require('./routes/cursos');

var app = express();

var mongoDB = "mongodb://mongodb:27017/material";
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão ao MongoDB"));
db.once("open", () => {
  console.log("Conexão ao MongoDB realizada com sucesso");
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recursos', recursosRouter);
app.use('/users', usersRouter);
app.use('/cursos', cursosRouter);

module.exports = app;