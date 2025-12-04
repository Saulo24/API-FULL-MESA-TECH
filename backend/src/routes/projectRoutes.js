const express = require('express');
const router = express.Router();
const { projectController } = require('../controllers');

// Rotas especiais primeiro
router.get('/stats', projectController.getProjectStats);

// CRUD básico
router.route('/')
  .get(projectController.getProjects)
  .post(projectController.createProject);

router.route('/:id')
  .get(projectController.getProject)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

// Colaboradores do projeto
router.post('/:id/collaborators', projectController.addCollaborator);
router.delete('/:id/collaborators/:collaboratorId', projectController.removeCollaborator);

module.exports = router;

