const { Project, Collaborator } = require('../models');

// @desc    Obter todos os projetos
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { status, prioridade, search, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (prioridade) {
      query.prioridade = prioridade;
    }
    
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { descricao: { $regex: search, $options: 'i' } },
        { cliente: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const projects = await Project.find(query)
      .populate('colaboradores.colaborador', 'nomeCompleto email cargo avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Project.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter projeto por ID
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('colaboradores.colaborador', 'nomeCompleto email cargo avatar horasSemanais horasAlocadas');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar projeto
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar projeto
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('colaboradores.colaborador', 'nomeCompleto email cargo avatar');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar projeto
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
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

// @desc    Adicionar colaborador ao projeto
// @route   POST /api/projects/:id/collaborators
exports.addCollaborator = async (req, res, next) => {
  try {
    const { colaboradorId, funcao, horasAlocadas } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }
    
    const collaborator = await Collaborator.findById(colaboradorId);
    
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }
    
    await project.adicionarColaborador(colaboradorId, funcao, horasAlocadas);
    
    // Atualizar horas alocadas do colaborador
    if (horasAlocadas) {
      collaborator.horasAlocadas += horasAlocadas;
      await collaborator.save();
    }
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('colaboradores.colaborador', 'nomeCompleto email cargo avatar');
    
    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remover colaborador do projeto
// @route   DELETE /api/projects/:id/collaborators/:collaboratorId
exports.removeCollaborator = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projeto não encontrado'
      });
    }
    
    await project.removerColaborador(req.params.collaboratorId);
    
    const updatedProject = await Project.findById(req.params.id)
      .populate('colaboradores.colaborador', 'nomeCompleto email cargo avatar');
    
    res.status(200).json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter estatísticas dos projetos
// @route   GET /api/projects/stats
exports.getProjectStats = async (req, res, next) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHorasEstimadas: { $sum: '$horasEstimadas' },
          totalHorasRealizadas: { $sum: '$horasRealizadas' }
        }
      }
    ]);
    
    const totalProjects = await Project.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        total: totalProjects,
        byStatus: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

