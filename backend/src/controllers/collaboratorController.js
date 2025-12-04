const { Collaborator } = require('../models');

// @desc    Obter todos os colaboradores
// @route   GET /api/collaborators
exports.getCollaborators = async (req, res, next) => {
  try {
    const { ativo, cargo, search, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (ativo !== undefined) {
      query.ativo = ativo === 'true';
    }
    
    if (cargo) {
      query.cargo = cargo;
    }
    
    if (search) {
      query.$or = [
        { nomeCompleto: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { matricula: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const collaborators = await Collaborator.find(query)
      .sort({ nomeCompleto: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Collaborator.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: collaborators.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: collaborators
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obter colaborador por ID
// @route   GET /api/collaborators/:id
exports.getCollaborator = async (req, res, next) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collaborator
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Criar colaborador
// @route   POST /api/collaborators
exports.createCollaborator = async (req, res, next) => {
  try {
    const collaborator = await Collaborator.create(req.body);
    
    res.status(201).json({
      success: true,
      data: collaborator
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Atualizar colaborador
// @route   PUT /api/collaborators/:id
exports.updateCollaborator = async (req, res, next) => {
  try {
    const collaborator = await Collaborator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: collaborator
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deletar colaborador
// @route   DELETE /api/collaborators/:id
exports.deleteCollaborator = async (req, res, next) => {
  try {
    const collaborator = await Collaborator.findByIdAndDelete(req.params.id);
    
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado'
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

// @desc    Obter colaboradores disponíveis
// @route   GET /api/collaborators/available
exports.getAvailableCollaborators = async (req, res, next) => {
  try {
    const { horasMinimas = 1 } = req.query;
    
    const collaborators = await Collaborator.find({
      ativo: true,
      $expr: { $gte: [{ $subtract: ['$horasSemanais', '$horasAlocadas'] }, parseInt(horasMinimas)] }
    }).sort({ nomeCompleto: 1 });
    
    res.status(200).json({
      success: true,
      count: collaborators.length,
      data: collaborators
    });
  } catch (error) {
    next(error);
  }
};

