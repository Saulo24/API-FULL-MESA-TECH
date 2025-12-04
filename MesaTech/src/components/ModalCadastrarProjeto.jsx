import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUserPlus, FiLoader, FiCheck } from 'react-icons/fi';
import { projectService, collaboratorService } from '../services';

const ModalCadastrarProjeto = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [searchCollab, setSearchCollab] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cliente: '',
    horasEstimadas: '',
    dataInicio: '',
    dataTermino: '',
    status: 'em_andamento',
    prioridade: 'media'
  });

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await collaboratorService.getAvailable(1);
      setCollaborators(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const toggleCollaborator = (collab) => {
    const isSelected = selectedCollaborators.find(c => c._id === collab._id);
    if (isSelected) {
      setSelectedCollaborators(prev => prev.filter(c => c._id !== collab._id));
    } else {
      setSelectedCollaborators(prev => [...prev, collab]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Preparar dados
      const dataToSend = {
        ...formData,
        horasEstimadas: parseInt(formData.horasEstimadas) || 0,
        colaboradores: selectedCollaborators.map(c => ({
          colaborador: c._id,
          funcao: 'Membro',
          horasAlocadas: 0
        }))
      };

      await projectService.create(dataToSend);
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Erro ao criar projeto:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar projeto');
    } finally {
      setLoading(false);
    }
  };

  const filteredCollaborators = collaborators.filter(c => 
    c.nomeCompleto?.toLowerCase().includes(searchCollab.toLowerCase()) ||
    c.cargo?.toLowerCase().includes(searchCollab.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.50)] flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Cadastrar novo Projeto</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </header>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Seção Esquerda: Informações do projeto */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-4">Informações do projeto</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nome do projeto *</label>
                    <input 
                      type="text" 
                      name="nome" 
                      value={formData.nome}
                      onChange={handleChange} 
                      required
                      className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
                    <input 
                      type="text" 
                      name="cliente" 
                      value={formData.cliente}
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md bg-gray-50" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Descrição do projeto</label>
                    <textarea 
                      name="descricao" 
                      rows="4" 
                      value={formData.descricao}
                      onChange={handleChange} 
                      className="w-full p-2 border rounded-md bg-gray-50"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <select 
                        name="status" 
                        value={formData.status}
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md bg-gray-50"
                      >
                        <option value="planejamento">Planejamento</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="pausado">Pausado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Prioridade</label>
                      <select 
                        name="prioridade" 
                        value={formData.prioridade}
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md bg-gray-50"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção Direita: Selecionar colaboradores */}
              <div>
                <div className="flex items-center mb-4">
                  <FiUserPlus className="text-red-500 mr-2" size={20}/>
                  <h3 className="font-semibold text-gray-700">Selecione os colaboradores</h3>
                </div>
                
                <div className="border rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto mb-4">
                  <div className="relative mb-3">
                    <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Pesquisar" 
                      value={searchCollab}
                      onChange={(e) => setSearchCollab(e.target.value)}
                      className="w-full p-2 pl-9 border rounded-md"
                    />
                  </div>
                  <ul className="space-y-2">
                    {filteredCollaborators.map(collab => {
                      const isSelected = selectedCollaborators.find(c => c._id === collab._id);
                      return (
                        <li 
                          key={collab._id} 
                          onClick={() => toggleCollaborator(collab)}
                          className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-100' : 'hover:bg-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                              {collab.nomeCompleto?.charAt(0) || 'C'}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-800">{collab.nomeCompleto}</span>
                              <p className="text-xs text-gray-500">{collab.cargo}</p>
                            </div>
                          </div>
                          {isSelected && <FiCheck className="text-blue-500" size={20} />}
                        </li>
                      );
                    })}
                    {filteredCollaborators.length === 0 && (
                      <li className="text-center text-gray-500 py-2">Nenhum colaborador encontrado</li>
                    )}
                  </ul>
                </div>

                {/* Colaboradores selecionados */}
                {selectedCollaborators.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Selecionados: {selectedCollaborators.length}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCollaborators.map(c => (
                        <span 
                          key={c._id} 
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                        >
                          {c.nomeCompleto?.split(' ')[0]}
                          <button 
                            type="button"
                            onClick={() => toggleCollaborator(c)}
                            className="ml-1 hover:text-blue-600"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Campos de Data e Horas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Horas estimadas</label>
                    <input 
                      type="number" 
                      name="horasEstimadas" 
                      value={formData.horasEstimadas}
                      onChange={handleChange} 
                      min="0"
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data de Início *</label>
                    <input 
                      type="date" 
                      name="dataInicio" 
                      value={formData.dataInicio}
                      onChange={handleChange} 
                      required
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data de Término *</label>
                    <input 
                      type="date" 
                      name="dataTermino" 
                      value={formData.dataTermino}
                      onChange={handleChange} 
                      required
                      className="w-full p-2 border rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <footer className="flex justify-end pt-6 mt-6 border-t space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 text-white font-semibold px-8 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading && <FiLoader className="animate-spin mr-2" />}
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCadastrarProjeto;
