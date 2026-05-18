const express = require('express');
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// Rutas para usuarios
router.route('/').post(createUser).get(getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;