import api from './api';

const projectService = {
  // Listar todos os projetos
  getAll: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Obter projeto por ID
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Criar novo projeto
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Atualizar projeto
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Deletar projeto
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Adicionar colaborador ao projeto
  addCollaborator: async (projectId, collaboratorData) => {
    const response = await api.post(`/projects/${projectId}/collaborators`, collaboratorData);
    return response.data;
  },

  // Remover colaborador do projeto
  removeCollaborator: async (projectId, collaboratorId) => {
    const response = await api.delete(`/projects/${projectId}/collaborators/${collaboratorId}`);
    return response.data;
  },

  // Obter estatísticas
  getStats: async () => {
    const response = await api.get('/projects/stats');
    return response.data;
  }
};

export default projectService;

