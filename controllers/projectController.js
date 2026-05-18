const Project = require('../models/Project');

exports.createProject = async (req, res, next) => {
  try {
    const { nombre, descripcion, tareas } = req.body;

    const project = await Project.create({
      nombre,
      descripcion,
      tareas,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('tareas');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};


exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('tareas');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('tareas');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado',
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