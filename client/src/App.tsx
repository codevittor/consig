import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Folder, Project, WorkspaceData, ActiveNavTab, KanbanColumnId, TaskPriority } from './types';
import { SidebarRail } from './components/SidebarRail';
import { FolderTreeSidebar } from './components/FolderTreeSidebar';
import { ProjectsPage } from './pages/ProjectsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CommandPalette } from './components/CommandPalette';
import { NewProjectModal } from './components/NewProjectModal';
import { NewFolderModal } from './components/NewFolderModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('projects');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const [foldersRes, projectsRes, workspaceRes] = await Promise.all([
        api.getFolders(),
        api.getProjects(),
        api.getWorkspace(),
      ]);
      setFolders(foldersRes);
      setProjects(projectsRes);
      setWorkspaceData(workspaceRes);
    } catch (err) {
      console.warn('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    loadData();
  };

  // Folder Operations
  const handleCreateFolder = async (folderData: {
    name: string;
    parentId?: string | null;
    color: string;
    description?: string;
  }) => {
    const newFolder = await api.createFolder(folderData);
    setFolders((prev) => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
    loadData();
  };

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta pasta?')) {
      await api.deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
      loadData();
    }
  };

  // Project Operations
  const handleCreateProject = async (projectData: Partial<Project>) => {
    const newProj = await api.createProject(projectData);
    setProjects((prev) => [newProj, ...prev]);
    loadData();
  };

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    const updated = await api.updateProject(id, updates);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    if (selectedProject?.id === id) {
      setSelectedProject(updated);
    }
  };

  const handleDeleteProject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
      loadData();
    }
  };

  // Task Operations
  const handleAddTask = async (
    projectId: string,
    task: { title: string; column: KanbanColumnId; priority: TaskPriority }
  ) => {
    const res = await api.addTask(projectId, task);
    setSelectedProject(res.project);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? res.project : p)));
  };

  const handleUpdateTask = async (projectId: string, taskId: string, updates: any) => {
    const res = await api.updateTask(projectId, taskId, updates);
    setSelectedProject(res.project);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? res.project : p)));
  };

  const handleDeleteTask = async (projectId: string, taskId: string) => {
    const res = await api.deleteTask(projectId, taskId);
    setSelectedProject(res.project);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? res.project : p)));
  };

  const handleResetDatabase = async () => {
    if (confirm('Deseja restaurar as pastas e projetos de exemplo iniciais?')) {
      await api.resetData();
      await loadData();
      setSelectedFolderId(null);
      setSelectedProject(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-[#fafafa] overflow-hidden select-none font-sans">
      {/* 1. Barra Lateral Primária (Ícone Valknut + Navegação nos 4 Módulos) */}
      <SidebarRail
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedProject(null);
        }}
        onResetDemo={handleResetDatabase}
      />

      {/* 2. Barra Lateral Secundária de Pastas (Exibida em Pastas ou Detalhe do Projeto) */}
      {(activeTab === 'projects' || selectedProject) && (
        <FolderTreeSidebar
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={(folderId) => {
            setSelectedFolderId(folderId);
            setSelectedProject(null);
            if (activeTab !== 'projects') setActiveTab('projects');
          }}
          onNewFolderClick={() => setIsNewFolderOpen(true)}
          onDeleteFolder={handleDeleteFolder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* 3. Área Principal do Workspace */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {selectedProject ? (
          <ProjectDetailPage
            project={selectedProject}
            onBack={handleBackToProjects}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={(id) => handleDeleteProject(id)}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <>
            {activeTab === 'projects' && (
              <ProjectsPage
                folders={folders}
                projects={projects}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onSelectProject={handleSelectProject}
                onNewProjectClick={() => setIsNewProjectOpen(true)}
                onNewFolderClick={() => setIsNewFolderOpen(true)}
                onDeleteProject={handleDeleteProject}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                workspaceData={workspaceData}
                projects={projects}
                onSelectProject={handleSelectProject}
                onNavigateToProjects={() => setActiveTab('projects')}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage
                projects={projects}
                workspaceData={workspaceData}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                workspaceData={workspaceData}
                projects={projects}
                folders={folders}
                onResetDatabase={handleResetDatabase}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Modais e Paleta de Comandos */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projects}
        folders={folders}
        onSelectProject={handleSelectProject}
        onSelectFolder={(fId) => {
          setSelectedFolderId(fId);
          setSelectedProject(null);
          setActiveTab('projects');
        }}
        onNewProject={() => setIsNewProjectOpen(true)}
        onNewFolder={() => setIsNewFolderOpen(true)}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        folders={folders}
        initialFolderId={selectedFolderId}
        onCreateProject={handleCreateProject}
      />

      <NewFolderModal
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        folders={folders}
        initialParentId={selectedFolderId}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default App;
