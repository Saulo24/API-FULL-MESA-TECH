const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middlewares');

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API MesaTech',
    version: '1.0.0',
    docs: '/api/health'
  });
});

// Handler de erros
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 MesaTech API Server                                  ║
║                                                           ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}                                ║
║   Porta: ${PORT}                                          ║
║   URL: http://localhost:${PORT}                               ║
║                                                           ║
║   Endpoints disponíveis:                                  ║
║   • GET  /api/health - Status da API                      ║
║   • GET  /api/collaborators - Listar colaboradores        ║
║   • GET  /api/projects - Listar projetos                  ║
║   • GET  /api/tasks - Listar tarefas                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Erro: ${err.message}`);
  server.close(() => process.exit(1));
});

