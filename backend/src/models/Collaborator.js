const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: [true, 'Nome completo é obrigatório'],
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
  matricula: {
    type: String,
    required: [true, 'Matrícula é obrigatória'],
    unique: true
  },
  cargo: {
    type: String,
    required: [true, 'Cargo é obrigatório'],
    enum: ['Desenvolvedor', 'Designer', 'Gerente de Projeto', 'Analista', 'QA', 'DevOps', 'Scrum Master', 'Product Owner', 'Estagiário']
  },
  departamento: {
    type: String,
    default: 'TI'
  },
  telefone: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  horasSemanais: {
    type: Number,
    default: 40,
    min: [1, 'Horas semanais deve ser no mínimo 1'],
    max: [60, 'Horas semanais não pode exceder 60']
  },
  horasAlocadas: {
    type: Number,
    default: 0
  },
  skills: [{
    type: String,
    trim: true
  }],
  dataAdmissao: {
    type: Date,
    default: Date.now
  },
  ativo: {
    type: Boolean,
    default: true
  },
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para horas disponíveis
collaboratorSchema.virtual('horasDisponiveis').get(function() {
  return this.horasSemanais - this.horasAlocadas;
});

// Virtual para nome formatado
collaboratorSchema.virtual('primeiroNome').get(function() {
  return this.nomeCompleto ? this.nomeCompleto.split(' ')[0] : '';
});

module.exports = mongoose.model('Collaborator', collaboratorSchema);

