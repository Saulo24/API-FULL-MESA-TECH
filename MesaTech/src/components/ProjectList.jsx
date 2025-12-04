import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { projectService } from '../services';
import { useRefresh } from '../contexts/RefreshContext';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    fetchProjects();
  }, [refreshKey]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getAll({ status: 'em_andamento', limit: 10 });
      setProjects(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Projetos em andamento</h2>
        <div className="flex space-x-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-72 h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Projetos em andamento</h2>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Projetos em andamento</h2>
        <Link to="/projetos" className="text-sm font-semibold text-blue-600 hover:underline">
          Visualizar tudo
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
          Nenhum projeto em andamento
        </div>
      ) : (
        <div className="flex space-x-6 pb-4 overflow-x-auto">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
          <div className="flex-shrink-0 w-1"></div>
        </div>
      )}
    </section>
  );
};

export default ProjectList;
