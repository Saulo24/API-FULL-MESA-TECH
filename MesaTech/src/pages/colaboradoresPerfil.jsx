import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiPhone, FiBriefcase, FiClock, FiCalendar, FiLoader } from 'react-icons/fi';
import { collaboratorService } from '../services';

const ColaboradoresPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collaborator, setCollaborator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCollaborator();
    }
  }, [id]);

  const fetchCollaborator = async () => {
    try {
      setLoading(true);
      const response = await collaboratorService.getById(id);
      setCollaborator(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar colaborador:', err);
      setError('Colaborador não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await collaboratorService.delete(id);
        navigate('/colaboradores');
      } catch (err) {
        console.error('Erro ao excluir colaborador:', err);
        alert('Erro ao excluir colaborador');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <FiLoader className="animate-spin text-blue-500" size={48} />
        </div>
      </main>
    );
  }

  if (error || !collaborator) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
          <p className="text-lg font-semibold mb-4">{error || 'Colaborador não encontrado'}</p>
          <Link to="/colaboradores" className="text-blue-600 hover:underline">
            ← Voltar para lista de colaboradores
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/colaboradores" className="text-gray-500 hover:text-gray-700">
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Perfil do Colaborador</h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            <FiEdit className="mr-2" /> Editar
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <FiTrash2 className="mr-2" /> Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Principal */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold">
              {collaborator.nomeCompleto?.charAt(0) || 'C'}
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 mb-1">{collaborator.nomeCompleto}</h2>
            <p className="text-gray-600 mb-4">{collaborator.cargo}</p>
            
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              collaborator.ativo 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {collaborator.ativo ? 'Ativo' : 'Inativo'}
            </span>

            {/* Contato */}
            <div className="mt-6 pt-6 border-t text-left space-y-3">
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-3 text-gray-400" />
                <span className="text-sm">{collaborator.email}</span>
              </div>
              {collaborator.telefone && (
                <div className="flex items-center text-gray-600">
                  <FiPhone className="mr-3 text-gray-400" />
                  <span className="text-sm">{collaborator.telefone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações Detalhadas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados Profissionais */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiBriefcase className="mr-2 text-gray-500" /> Dados Profissionais
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Matrícula</p>
                <p className="font-semibold text-gray-800">{collaborator.matricula}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-semibold text-gray-800">{collaborator.departamento || 'TI'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Admissão</p>
                <p className="font-semibold text-gray-800">{formatDate(collaborator.dataAdmissao)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cargo</p>
                <p className="font-semibold text-gray-800">{collaborator.cargo}</p>
              </div>
            </div>
          </div>

          {/* Carga Horária */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiClock className="mr-2 text-gray-500" /> Carga Horária
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 mb-1">Horas Semanais</p>
                <p className="text-2xl font-bold text-blue-700">{collaborator.horasSemanais || 40}h</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-orange-600 mb-1">Horas Alocadas</p>
                <p className="text-2xl font-bold text-orange-700">{collaborator.horasAlocadas || 0}h</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-600 mb-1">Horas Disponíveis</p>
                <p className="text-2xl font-bold text-green-700">
                  {(collaborator.horasSemanais || 40) - (collaborator.horasAlocadas || 0)}h
                </p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Utilização</span>
                <span>
                  {Math.round(((collaborator.horasAlocadas || 0) / (collaborator.horasSemanais || 40)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min(((collaborator.horasAlocadas || 0) / (collaborator.horasSemanais || 40)) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {collaborator.skills && collaborator.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {collaborator.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ColaboradoresPerfil;
