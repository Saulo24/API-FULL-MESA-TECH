const mongoose = require('mongoose');
require('dotenv').config();

const { Collaborator, Project } = require('../models');
const connectDB = require('../config/database');

const collaborators = [
  {
    nomeCompleto: 'Ana Silva Santos',
    email: 'ana.silva@mesatech.com',
    matricula: 'MT001',
    cargo: 'Gerente de Projeto',
    departamento: 'TI',
    horasSemanais: 40,
    horasAlocadas: 20,
    skills: ['Gestão de Projetos', 'Scrum', 'Kanban'],
    ativo: true
  },
  {
    nomeCompleto: 'Carlos Oliveira',
    email: 'carlos.oliveira@mesatech.com',
    matricula: 'MT002',
    cargo: 'Desenvolvedor',
    departamento: 'TI',
    horasSemanais: 40,
    horasAlocadas: 30,
    skills: ['JavaScript', 'React', 'Node.js'],
    ativo: true
  },
  {
    nomeCompleto: 'Maria Fernanda Costa',
    email: 'maria.costa@mesatech.com',
    matricula: 'MT003',
    cargo: 'Designer',
    departamento: 'TI',
    horasSemanais: 40,
    horasAlocadas: 25,
    skills: ['UI/UX', 'Figma', 'Adobe XD'],
    ativo: true
  },
  {
    nomeCompleto: 'João Pedro Almeida',
    email: 'joao.almeida@mesatech.com',
    matricula: 'MT004',
    cargo: 'Analista',
    departamento: 'TI',
    horasSemanais: 40,
    horasAlocadas: 15,
    skills: ['Análise de Requisitos', 'SQL', 'Power BI'],
    ativo: true
  },
  {
    nomeCompleto: 'Lucia Rodrigues',
    email: 'lucia.rodrigues@mesatech.com',
    matricula: 'MT005',
    cargo: 'QA',
    departamento: 'TI',
    horasSemanais: 40,
    horasAlocadas: 20,
    skills: ['Testes Automatizados', 'Selenium', 'Jest'],
    ativo: true
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Limpar dados existentes
    await Collaborator.deleteMany({});
    await Project.deleteMany({});
    
    console.log('🗑️  Dados anteriores removidos');
    
    // Inserir colaboradores
    const createdCollaborators = await Collaborator.insertMany(collaborators);
    console.log(`✅ ${createdCollaborators.length} colaboradores criados`);
    
    // Criar projetos de exemplo
    const projects = [
      {
        nome: 'Sistema de Gestão MesaTech',
        descricao: 'Desenvolvimento do sistema interno de gestão de projetos',
        cliente: 'MesaTech',
        dataInicio: new Date('2024-01-15'),
        dataTermino: new Date('2024-06-30'),
        horasEstimadas: 500,
        horasRealizadas: 200,
        status: 'em_andamento',
        prioridade: 'alta',
        cor: '#3B82F6',
        colaboradores: [
          { colaborador: createdCollaborators[0]._id, funcao: 'Gerente', horasAlocadas: 10 },
          { colaborador: createdCollaborators[1]._id, funcao: 'Desenvolvedor', horasAlocadas: 20 }
        ]
      },
      {
        nome: 'App Mobile Cliente XYZ',
        descricao: 'Aplicativo mobile para o cliente XYZ',
        cliente: 'XYZ Corp',
        dataInicio: new Date('2024-02-01'),
        dataTermino: new Date('2024-08-31'),
        horasEstimadas: 800,
        horasRealizadas: 100,
        status: 'em_andamento',
        prioridade: 'media',
        cor: '#10B981',
        colaboradores: [
          { colaborador: createdCollaborators[2]._id, funcao: 'Designer', horasAlocadas: 15 },
          { colaborador: createdCollaborators[3]._id, funcao: 'Analista', horasAlocadas: 10 }
        ]
      },
      {
        nome: 'Portal E-commerce ABC',
        descricao: 'Plataforma de e-commerce para ABC Store',
        cliente: 'ABC Store',
        dataInicio: new Date('2024-03-01'),
        dataTermino: new Date('2024-12-31'),
        horasEstimadas: 1200,
        horasRealizadas: 50,
        status: 'planejamento',
        prioridade: 'baixa',
        cor: '#F59E0B'
      }
    ];
    
    const createdProjects = await Project.insertMany(projects);
    console.log(`✅ ${createdProjects.length} projetos criados`);
    
    console.log('\n🎉 Seed concluído com sucesso!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedDB();

