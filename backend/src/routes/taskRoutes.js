const express = require('express');
const router = express.Router();
const { taskController } = require('../controllers');

// CRUD básico
router.route('/')
  .get(taskController.getTasks)
  .post(taskController.createTask);

router.route('/:id')
  .get(taskController.getTask)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

// Comentários e subtarefas
router.post('/:id/comments', taskController.addComment);
router.put('/:id/subtasks/:subtaskId', taskController.toggleSubtask);

module.exports = router;

