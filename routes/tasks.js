const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

// Rutas para tareas
router.route('/').post(createTask).get(getTasks);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;