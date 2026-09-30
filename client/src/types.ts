export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  icon: string;
  color: string;
  description?: string;
  itemCount?: number;
  directCount?: number;
}

export type ProjectStatus = 'Em Andamento' | 'Concluído' | 'Em Revisão' | 'Planejado' | 'Pausado';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type KanbanColumnId = 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  column: KanbanColumnId;
  priority: TaskPriority;
  dueDate?: string | null;
  tags: string[];
  completed: boolean;
  assignee?: {
    name: string;
    avatar: string;
  };
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'figma' | 'github' | 'docs' | 'live' | 'other';
}

export interface TimelineItem {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Project {
  id: string;
  title: string;
  folderId: string | null;
  category: string;
  status: ProjectStatus;
  priority: string;
  author: {
    name: string;
    email: string;
    avatar: string;
  };
  fileExtension: string;
  fileSize: string;
  updatedAt: string;
  createdAt: string;
  dueDate: string;
  client: string;
  description: string;
  starred: boolean;
  resources: Resource[];
  notes: string;
  tasks: Task[];
  timeline: TimelineItem[];
}

export interface WorkspaceStats {
  totalProjects: number;
  totalFolders: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  productivityRate: number;
}

export interface WorkspaceInfo {
  name: string;
  owner: string;
  email: string;
  tagline: string;
}

export interface WorkspaceData {
  workspace: WorkspaceInfo;
  stats: WorkspaceStats;
  recentProjects: Project[];
}

export type ActiveNavTab = 'dashboard' | 'projects' | 'analytics' | 'settings';
