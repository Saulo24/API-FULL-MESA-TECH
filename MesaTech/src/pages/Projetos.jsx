import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiChevronDown, FiCalendar, FiUserPlus, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { projectService } from '../services';
import { useRefresh } from '../contexts/RefreshContext';

// Componente para card de projeto na listagem
const ProjectGridCard = ({ project }) => {
  const progress = project.progresso || 
    (project.horasEstimadas > 0 
      ? Math.round((project.horasRealizadas / project.horasEstimadas) * 100) 
      : 0);

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = () => {
    switch (project.status) {
      case 'planejamento': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-green-100 text-green-800';
      case 'pausado': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (project.status) {
      case 'planejamento': return 'Planejamento';
      case 'em_andamento': return 'Em Andamento';
      case 'pausado': return 'Pausado';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return project.status;
    }
  };

  const getPriorityColor = () => {
    switch (project.prioridade) {
      case 'critica': return 'border-l-red-500';
      case 'alta': return 'border-l-orange-500';
      case 'media': return 'border-l-yellow-500';
      case 'baixa': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor()} p-5 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{project.nome}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>
      
      {project.cliente && (
        <p className="text-sm text-gray-500 mb-3">{project.cliente}</p>
      )}
      
      {project.descricao && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.descricao}</p>
      )}

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Início: {formatDate(project.dataInicio)}</span>
        <span>Término: {formatDate(project.dataTermino)}</span>
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {project.horasRealizadas || 0}h / {project.horasEstimadas || 0}h
        </span>
        {project.totalColaboradores > 0 && (
          <span className="text-xs text-gray-500">
            {project.totalColaboradores} colaborador{project.totalColaboradores > 1 ? 'es' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

function Projetos() {
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, refreshKey]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const response = await projectService.getAll(params);
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const statuses = [
    { value: '', label: 'Todos' },
    { value: 'planejamento', label: 'Planejamento' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'pausado', label: 'Pausado' },
    { value: 'concluido', label: 'Concluído' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Projetos</h1>
        
        <div className="flex items-center justify-between">
          {/* Filtros */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              Total: {projects.length}
            </span>
            
            {/* Filtro por status */}
            <div className="flex space-x-2">
              {statuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    statusFilter === status.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar projeto..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      )}

      {/* Lista de Projetos */}
      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
              Nenhum projeto encontrado
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectGridCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Projetos;
