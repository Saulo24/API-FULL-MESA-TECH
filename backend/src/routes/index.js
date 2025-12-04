const express = require('express');
const router = express.Router();

const collaboratorRoutes = require('./collaboratorRoutes');
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API MesaTech funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas
router.use('/collaborators', collaboratorRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;

