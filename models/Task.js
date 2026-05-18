const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  título: {
    type: String,
    required: true,
    trim: true,
  },
  descripción: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completada'],
    default: 'pendiente',
  },
  fechaCreación: {
    type: Date,
    default: Date.now,
  },
  fechaLímite: {
    type: Date,
    required: true,
  },
  asignadoA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);