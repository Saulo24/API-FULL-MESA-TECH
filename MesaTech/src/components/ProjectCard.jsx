import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  // Calcular progresso
  const progress = project.progresso || 
    (project.horasEstimadas > 0 
      ? Math.round((project.horasRealizadas / project.horasEstimadas) * 100) 
      : 0);

  // Formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return '--/--/----';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Cor da barra de progresso baseada no progresso
  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-400';
    if (progress < 50) return 'bg-orange-400';
    if (progress < 75) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  // Cor do status
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

  return (
    <Link 
      to={`/projetos?id=${project._id}`}
      className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Cabeçalho do Card */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 uppercase">{project.nome}</h3>
          {project.cliente && (
            <p className="text-sm text-gray-500">{project.cliente}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progresso</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getProgressColor()}`} 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Horas */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <span>Horas: {project.horasRealizadas || 0}h / {project.horasEstimadas || 0}h</span>
      </div>

      {/* Datas */}
      <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
        <div>
          <p className="font-medium">Início</p>
          <p>{formatDate(project.dataInicio)}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Término</p>
          <p>{formatDate(project.dataTermino)}</p>
        </div>
      </div>

      {/* Colaboradores */}
      {project.totalColaboradores > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">
            {project.totalColaboradores} colaborador{project.totalColaboradores > 1 ? 'es' : ''}
          </p>
        </div>
      )}
    </Link>
  );
};

export default ProjectCard;
