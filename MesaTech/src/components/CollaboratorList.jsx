import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { collaboratorService } from '../services';
import { useRefresh } from '../contexts/RefreshContext';

const CollaboratorList = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchCollaborators();
  }, [refreshKey]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const response = await collaboratorService.getAvailable(1);
      setCollaborators(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
      setError('Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await collaboratorService.delete(id);
        fetchCollaborators();
      } catch (err) {
        console.error('Erro ao excluir colaborador:', err);
        alert('Erro ao excluir colaborador');
      }
    }
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Colaboradores disponíveis</h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Colaboradores disponíveis</h2>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Colaboradores disponíveis</h2>
        <Link to="/colaboradores" className="text-sm font-semibold text-blue-600 hover:underline">
          Visualizar tudo
        </Link>
      </div>
      
      {collaborators.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
          Nenhum colaborador disponível
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Cabeçalho da Lista */}
          <div className="grid grid-cols-12 gap-4 text-left text-sm font-semibold text-gray-500 px-4 py-2 border-b">
            <div className="col-span-4">Nome</div>
            <div className="col-span-2">Matrícula</div>
            <div className="col-span-2">Cargo</div>
            <div className="col-span-2">Horas disponíveis</div>
            <div className="col-span-2 text-center">Ações</div>
          </div>
          
          {/* Itens da Lista */}
          <div className="divide-y divide-gray-100">
            {collaborators.map(collab => (
              <Link 
                to={`/colaboradores/${collab._id}`} 
                key={collab._id} 
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 hover:bg-gray-50"
              >
                <div className="col-span-4 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                    {collab.nomeCompleto?.charAt(0) || 'C'}
                  </div>
                  <span className="font-semibold text-gray-800">{collab.nomeCompleto}</span>
                </div>
                <div className="col-span-2 text-gray-600">{collab.matricula}</div>
                <div className="col-span-2 text-gray-600">{collab.cargo}</div>
                <div className="col-span-2 text-gray-600">
                  {collab.horasDisponiveis || (collab.horasSemanais - collab.horasAlocadas)} horas
                </div>
                <div className="col-span-2 flex items-center justify-center space-x-2">
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                  >
                    <FiPlus className="mr-1"/> Atribuir
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-500 hover:text-blue-600 p-1"
                  >
                    <FiEdit size={18}/>
                  </button>
                  <button 
                    onClick={(e) => handleDelete(collab._id, e)}
                    className="text-gray-500 hover:text-red-600 p-1"
                  >
                    <FiTrash2 size={18}/>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default CollaboratorList;
