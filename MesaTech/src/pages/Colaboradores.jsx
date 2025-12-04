import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi';
import { collaboratorService } from '../services';
import { useRefresh } from '../contexts/RefreshContext';

const CollaboratorTable = ({ collaborators, onDelete, onRefresh }) => {
  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      try {
        await collaboratorService.delete(id);
        onRefresh();
      } catch (err) {
        console.error('Erro ao excluir colaborador:', err);
        alert('Erro ao excluir colaborador');
      }
    }
  };

  if (collaborators.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        Nenhum colaborador encontrado
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Cabeçalho da Tabela */}
      <div className="flex text-left text-xs font-semibold text-gray-500 uppercase px-6 py-4 border-b border-gray-200">
        <div className="w-4/12">Nome</div>
        <div className="w-2/12">Matrícula</div>
        <div className="w-2/12">Cargo</div>
        <div className="w-1/12">Horas disponíveis</div>
        <div className="w-3/12 text-center">Ações</div>
      </div>

      {/* Corpo da Tabela */}
      <div>
        {collaborators.map(collab => (
          <Link 
            to={`/colaboradores/${collab._id}`} 
            key={collab._id} 
            className="flex items-center px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <div className="w-4/12 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                {collab.nomeCompleto?.charAt(0) || 'C'}
              </div>
              <span className="font-semibold text-gray-800">{collab.nomeCompleto}</span>
            </div>
            <div className="w-2/12 text-gray-600">{collab.matricula}</div>
            <div className="w-2/12 text-gray-600">{collab.cargo}</div>
            <div className="w-1/12 text-gray-600">
              {collab.horasDisponiveis || (collab.horasSemanais - collab.horasAlocadas)} horas
            </div>
            <div className="w-3/12 flex items-center justify-center space-x-2">
              <button 
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-sm border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-100"
              >
                <FiPlus size={16} className="mr-1"/> Atribuir projeto
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
  );
};


function Colaboradores() {
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchCollaborators();
  }, [refreshKey]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterCargo) params.cargo = filterCargo;
      
      const response = await collaboratorService.getAll(params);
      setCollaborators(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
      setError('Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCollaborators();
  };

  const cargos = ['Desenvolvedor', 'Designer', 'Gerente de Projeto', 'Analista', 'QA', 'DevOps', 'Scrum Master', 'Product Owner', 'Estagiário'];

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Cabeçalho da página de Colaboradores */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Colaboradores</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              Total: {collaborators.length}
            </span>
            
            {/* Filtro por cargo */}
            <select 
              value={filterCargo}
              onChange={(e) => {
                setFilterCargo(e.target.value);
                setTimeout(fetchCollaborators, 100);
              }}
              className="text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-1.5"
            >
              <option value="">Todos os cargos</option>
              {cargos.map(cargo => (
                <option key={cargo} value={cargo}>{cargo}</option>
              ))}
            </select>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-2 animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Tabela de Colaboradores */}
      {!loading && !error && (
        <CollaboratorTable 
          collaborators={collaborators} 
          onRefresh={fetchCollaborators}
        />
      )}
    </main>
  );
}

export default Colaboradores;
