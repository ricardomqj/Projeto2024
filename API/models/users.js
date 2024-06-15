const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  escola: { type: String, required: true },
  curso: { type: String, required: true },
  departamento: { type: String, required: true },
  cargo: { type: String, required: true },
  registo: { type: Date, required: true, default: Date.now },
  ultimoAcesso: { type: Date, required: true, default: Date.now },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recurso' }] // Adiciona o campo favoritos
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);