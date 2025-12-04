const mongoose = require('mongoose');

const subtarefaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  concluida: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const comentarioSchema = new mongoose.Schema({
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  texto: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const taskSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título da tarefa é obrigatório'],
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },
  descricao: {
    type: String,
    default: ''
  },
  projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Projeto é obrigatório']
  },
  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator',
    default: null
  },
  status: {
    type: String,
    enum: ['pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada'],
    default: 'pendente'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'critica'],
    default: 'media'
  },
  dataInicio: {
    type: Date,
    default: null
  },
  dataVencimento: {
    type: Date,
    default: null
  },
  dataConclusao: {
    type: Date,
    default: null
  },
  horasEstimadas: {
    type: Number,
    default: 0
  },
  horasRealizadas: {
    type: Number,
    default: 0
  },
  subtarefas: [subtarefaSchema],
  comentarios: [comentarioSchema],
  anexos: [{
    nome: String,
    url: String,
    tipo: String,
    tamanho: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para progresso das subtarefas
taskSchema.virtual('progressoSubtarefas').get(function() {
  if (!this.subtarefas || this.subtarefas.length === 0) return 0;
  const concluidas = this.subtarefas.filter(s => s.concluida).length;
  return Math.round((concluidas / this.subtarefas.length) * 100);
});

// Método para marcar/desmarcar subtarefa
taskSchema.methods.toggleSubtarefa = function(subtarefaId) {
  if (!this.subtarefas) return this.save();
  
  const subtarefa = this.subtarefas.id(subtarefaId);
  if (subtarefa) {
    subtarefa.concluida = !subtarefa.concluida;
  }
  return this.save();
};

// Método para adicionar comentário
taskSchema.methods.adicionarComentario = function(autorId, texto) {
  this.comentarios.push({
    autor: autorId,
    texto,
    createdAt: new Date()
  });
  return this.save();
};

// Índices para melhor performance
taskSchema.index({ projeto: 1, status: 1 });
taskSchema.index({ responsavel: 1 });

module.exports = mongoose.model('Task', taskSchema);

