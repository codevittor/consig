import { Folder, Project, Task, WorkspaceData } from '../types';

const API_BASE = '/api';

export const api = {
  async getWorkspace(): Promise<WorkspaceData> {
    const res = await fetch(`${API_BASE}/workspace`);
    if (!res.ok) throw new Error('Falha ao carregar informações do workspace');
    return res.json();
  },

  async getFolders(): Promise<Folder[]> {
    const res = await fetch(`${API_BASE}/folders`);
    if (!res.ok) throw new Error('Falha ao carregar pastas');
    return res.json();
  },

  async createFolder(data: { name: string; parentId?: string | null; icon?: string; color?: string; description?: string }): Promise<Folder> {
    const res = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar pasta');
    return res.json();
  },

  async deleteFolder(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir pasta');
  },

  async getProjects(params?: { folderId?: string; search?: string; category?: string; status?: string }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.folderId) query.append('folderId', params.folderId);
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar projetos');
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar projeto');
    return res.json();
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar projeto');
    return res.json();
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao atualizar projeto');
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir projeto');
  },

  async addTask(projectId: string, task: Partial<Task>): Promise<{ task: Task; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Falha ao adicionar tarefa');
    return res.json();
  },

  async updateTask(projectId: string, taskId: string, updates: Partial<Task>): Promise<{ task: Task; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Falha ao atualizar tarefa');
    return res.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<{ success: boolean; project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Falha ao excluir tarefa');
    return res.json();
  },

  async resetData(): Promise<void> {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Falha ao resetar banco');
  }
};
