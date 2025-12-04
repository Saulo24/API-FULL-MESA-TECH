const express = require('express');
const router = express.Router();
const { collaboratorController } = require('../controllers');

// Rotas especiais primeiro
router.get('/available', collaboratorController.getAvailableCollaborators);

// CRUD básico
router.route('/')
  .get(collaboratorController.getCollaborators)
  .post(collaboratorController.createCollaborator);

router.route('/:id')
  .get(collaboratorController.getCollaborator)
  .put(collaboratorController.updateCollaborator)
  .delete(collaboratorController.deleteCollaborator);

module.exports = router;

