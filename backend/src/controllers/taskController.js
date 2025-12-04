const { Task, Project } = require('../models');

// @desc    Obter todas as tarefas
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    const { projeto, status, responsavel, prioridade, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (projeto) {
      query.projeto = projeto;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (responsavel) {
      query.responsavel = responsavel;
    }
    
    if (prioridade) {
      query.prioridade = prioridade;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const tasks = await Task.find(query)
      .populate('projeto', 'nome cor')
      .populate('responsavel', 'nomeCompleto email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Task.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter tarefa por ID
// @route   GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projeto', 'nome cor status')
      .populate('responsavel', 'nomeCompleto email avatar')
      .populate('comentarios.autor', 'nome email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar tarefa
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
  try {
    // Verificar se o projeto existe
    const project = await Project.findById(req.body.projeto);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }
    
    const task = await Task.create(req.body);
    
    const populatedTask = await Task.findById(task._id)
      .populate('projeto', 'nome cor')
      .populate('responsavel', 'nomeCompleto email avatar');
    
    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar tarefa
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    // Se status mudou para concluida, definir dataConclusao
    if (req.body.status === 'concluida') {
      req.body.dataConclusao = new Date();
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('projeto', 'nome cor')
      .populate('responsavel', 'nomeCompleto email avatar');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar tarefa
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Adicionar comentário à tarefa
// @route   POST /api/tasks/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }
    
    task.comentarios.push({
      texto: req.body.texto,
      createdAt: new Date()
    });
    
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtarefa
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
exports.toggleSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Tarefa não encontrada'
      });
    }
    
    await task.toggleSubtarefa(req.params.subtaskId);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter tarefas por projeto
// @route   GET /api/projects/:projectId/tasks
exports.getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ projeto: req.params.projectId })
      .populate('responsavel', 'nomeCompleto email avatar')
      .sort({ prioridade: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

