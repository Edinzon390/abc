const Task = require('../models/Task');


exports.createTask = async (req, res, next) => {
  try {
    const { título, descripción, estado, fechaLímite, asignadoA } = req.body;

    const task = await Task.create({
      título,
      descripción,
      estado,
      fechaLímite,
      asignadoA,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('asignadoA', 'nombre email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('asignadoA', 'nombre email');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('asignadoA', 'nombre email');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarea no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};