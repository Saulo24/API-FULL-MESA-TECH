const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode ter mais de 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'gerente', 'colaborador', 'visualizador'],
    default: 'colaborador'
  },
  avatar: {
    type: String,
    default: null
  },
  ativo: {
    type: Boolean,
    default: true
  },
  ultimoAcesso: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Comparar senha
userSchema.methods.comparePassword = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

// Gerar token JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = mongoose.model('User', userSchema);

