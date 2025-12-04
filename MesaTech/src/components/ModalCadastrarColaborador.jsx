import React, { useState } from 'react';
import { FiX, FiCamera, FiLoader } from 'react-icons/fi';
import { collaboratorService } from '../services';

const ModalCadastrarColaborador = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    matricula: '',
    cargo: '',
    departamento: 'TI',
    horasSemanais: 40,
    dataAdmissao: '',
    skills: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        horasSemanais: parseInt(formData.horasSemanais) || 40,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : []
      };

      await collaboratorService.create(dataToSend);
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Erro ao criar colaborador:', err);
      setError(err.response?.data?.error || 'Erro ao cadastrar colaborador');
    } finally {
      setLoading(false);
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const cargos = [
    'Desenvolvedor',
    'Designer',
    'Gerente de Projeto',
    'Analista',
    'QA',
    'DevOps',
    'Scrum Master',
    'Product Owner',
    'Estagiário'
  ];

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.50)] flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={handleModalContentClick}
      >
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Cadastrar novo colaborador</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Avatar placeholder */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  {formData.nomeCompleto?.charAt(0) || '?'}
                </div>
                <button type="button" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                  <FiCamera className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Informações Pessoais */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informações pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nome completo *</label>
                  <input 
                    type="text" 
                    name="nomeCompleto" 
                    value={formData.nomeCompleto}
                    onChange={handleChange} 
                    required
                    className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">E-mail *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange} 
                    required
                    className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
                  <input 
                    type="text" 
                    name="telefone" 
                    value={formData.telefone}
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </section>

            {/* Dados Profissionais */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Dados profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Matrícula *</label>
                  <input 
                    type="text" 
                    name="matricula" 
                    value={formData.matricula}
                    onChange={handleChange} 
                    required
                    className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Cargo *</label>
                  <select 
                    name="cargo" 
                    value={formData.cargo}
                    onChange={handleChange} 
                    required
                    className="w-full p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    {cargos.map(cargo => (
                      <option key={cargo} value={cargo}>{cargo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Departamento</label>
                  <input 
                    type="text" 
                    name="departamento" 
                    value={formData.departamento}
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Horas semanais</label>
                  <input 
                    type="number" 
                    name="horasSemanais" 
                    value={formData.horasSemanais}
                    onChange={handleChange}
                    min="1"
                    max="60"
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data de admissão</label>
                  <input 
                    type="date" 
                    name="dataAdmissao" 
                    value={formData.dataAdmissao}
                    onChange={handleChange} 
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Skills (separadas por vírgula)</label>
                  <input 
                    type="text" 
                    name="skills" 
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full p-2 border rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </section>
            
            <footer className="flex justify-end pt-4 border-t space-x-3">
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
                className="bg-green-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
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

export default ModalCadastrarColaborador;
