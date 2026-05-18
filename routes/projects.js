const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// Rutas para proyectos
router.route('/').post(createProject).get(getProjects);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;