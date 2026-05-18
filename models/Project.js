const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  tareas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);