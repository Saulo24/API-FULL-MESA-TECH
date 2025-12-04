import api from './api';

const taskService = {
  // Listar todas as tarefas
  getAll: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  // Obter tarefa por ID
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Criar nova tarefa
  create: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Atualizar tarefa
  update: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Deletar tarefa
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Adicionar comentário
  addComment: async (taskId, texto) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { texto });
    return response.data;
  },

  // Toggle subtarefa
  toggleSubtask: async (taskId, subtaskId) => {
    const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  }
};

export default taskService;

