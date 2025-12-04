import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ModalCadastrarColaborador from './ModalCadastrarColaborador';
import ModalCadastrarProjeto from './ModalCadastrarProjeto';
import { RefreshProvider, useRefresh } from '../contexts/RefreshContext';

function MainLayoutContent() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCollaboratorModalOpen, setCollaboratorModalOpen] = useState(false);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const { triggerRefresh } = useRefresh();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const handleOpenCollaboratorModal = () => setCollaboratorModalOpen(true);
  const handleCloseCollaboratorModal = () => setCollaboratorModalOpen(false);

  const handleOpenProjectModal = () => setProjectModalOpen(true);
  const handleCloseProjectModal = () => setProjectModalOpen(false);

  const handleCollaboratorSuccess = () => {
    triggerRefresh();
  };

  const handleProjectSuccess = () => {
    triggerRefresh();
  };

  return (
    <div className="flex h-screen bg-main-bg font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={toggleSidebar} 
        onAddCollaboratorClick={handleOpenCollaboratorModal}
        onAddProjectClick={handleOpenProjectModal}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <Outlet />
      </div>

      {isCollaboratorModalOpen && (
        <ModalCadastrarColaborador 
          onClose={handleCloseCollaboratorModal}
          onSuccess={handleCollaboratorSuccess}
        />
      )}
      {isProjectModalOpen && (
        <ModalCadastrarProjeto 
          onClose={handleCloseProjectModal}
          onSuccess={handleProjectSuccess}
        />
      )}
    </div>
  );
}

function MainLayout() {
  return (
    <RefreshProvider>
      <MainLayoutContent />
    </RefreshProvider>
  );
}

export default MainLayout;
