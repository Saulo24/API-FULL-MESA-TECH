const mongoose = require('mongoose');

const colaboradorProjetoSchema = new mongoose.Schema({
  colaborador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collaborator',
    required: true
  },
  funcao: {
    type: String,
    default: 'Membro'
  },
  horasAlocadas: {
    type: Number,
    default: 0
  },
  dataEntrada: {
    type: Date,
    default: Date.now
  },
  dataSaida: {
    type: Date,
    default: null
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do projeto é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome não pode ter mais de 200 caracteres']
  },
  descricao: {
    type: String,
    default: ''
  },
  cliente: {
    type: String,
    default: ''
  },
  dataInicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  dataTermino: {
    type: Date,
    required: [true, 'Data de término é obrigatória']
  },
  horasEstimadas: {
    type: Number,
    default: 0,
    min: [0, 'Horas estimadas não pode ser negativo']
  },
  horasRealizadas: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado'],
    default: 'planejamento'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'critica'],
    default: 'media'
  },
  colaboradores: [colaboradorProjetoSchema],
  tags: [{
    type: String,
    trim: true
  }],
  cor: {
    type: String,
    default: '#3B82F6'
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

// Virtual para progresso
projectSchema.virtual('progresso').get(function() {
  if (!this.horasEstimadas || this.horasEstimadas === 0) return 0;
  return Math.min(Math.round((this.horasRealizadas / this.horasEstimadas) * 100), 100);
});

// Virtual para total de colaboradores ativos
projectSchema.virtual('totalColaboradores').get(function() {
  if (!this.colaboradores || !Array.isArray(this.colaboradores)) return 0;
  return this.colaboradores.filter(c => !c.dataSaida).length;
});

// Virtual para dias restantes
projectSchema.virtual('diasRestantes').get(function() {
  if (!this.dataTermino) return null;
  const hoje = new Date();
  const termino = new Date(this.dataTermino);
  const diff = Math.ceil((termino - hoje) / (1000 * 60 * 60 * 24));
  return diff;
});

// Método para adicionar colaborador
projectSchema.methods.adicionarColaborador = function(colaboradorId, funcao = 'Membro', horasAlocadas = 0) {
  const existente = this.colaboradores.find(
    c => c.colaborador.toString() === colaboradorId.toString() && !c.dataSaida
  );
  
  if (existente) {
    throw new Error('Colaborador já está no projeto');
  }
  
  this.colaboradores.push({
    colaborador: colaboradorId,
    funcao,
    horasAlocadas,
    dataEntrada: new Date()
  });
  
  return this.save();
};

// Método para remover colaborador
projectSchema.methods.removerColaborador = function(colaboradorId) {
  const colaborador = this.colaboradores.find(
    c => c.colaborador.toString() === colaboradorId.toString() && !c.dataSaida
  );
  
  if (colaborador) {
    colaborador.dataSaida = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);

