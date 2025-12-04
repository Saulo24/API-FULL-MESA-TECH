import api from './api';

const collaboratorService = {
  // Listar todos os colaboradores
  getAll: async (params = {}) => {
    const response = await api.get('/collaborators', { params });
    return response.data;
  },

  // Obter colaborador por ID
  getById: async (id) => {
    const response = await api.get(`/collaborators/${id}`);
    return response.data;
  },

  // Criar novo colaborador
  create: async (data) => {
    const response = await api.post('/collaborators', data);
    return response.data;
  },

  // Atualizar colaborador
  update: async (id, data) => {
    const response = await api.put(`/collaborators/${id}`, data);
    return response.data;
  },

  // Deletar colaborador
  delete: async (id) => {
    const response = await api.delete(`/collaborators/${id}`);
    return response.data;
  },

  // Obter colaboradores disponíveis
  getAvailable: async (horasMinimas = 1) => {
    const response = await api.get('/collaborators/available', {
      params: { horasMinimas }
    });
    return response.data;
  }
};

export default collaboratorService;

