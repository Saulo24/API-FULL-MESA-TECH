// Funções auxiliares

// Formatar data para exibição
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('pt-BR');
};

// Calcular diferença em dias entre duas datas
const diffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Gerar slug a partir de uma string
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

// Paginar resultados
const paginate = (page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return { skip, limit: parseInt(limit) };
};

module.exports = {
  formatDate,
  diffInDays,
  generateSlug,
  paginate
};

