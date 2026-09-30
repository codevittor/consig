import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function loadDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Erro ao carregar banco de dados:', error);
    return initialData;
  }
}

function saveDatabase(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erro ao salvar banco de dados:', error);
  }
}

function enrichFolders(folders, projects) {
  return folders.map(f => {
    const directCount = projects.filter(p => p.folderId === f.id).length;
    const childIds = folders.filter(c => c.parentId === f.id).map(c => c.id);
    const childCount = projects.filter(p => childIds.includes(p.folderId)).length;
    return {
      ...f,
      itemCount: directCount + childCount,
      directCount
    };
  });
}

// 1. Resumo do Workspace e Métricas
app.get('/api/workspace', (req, res) => {
  const db = loadDatabase();
  const totalProjects = db.projects.length;
  let totalTasks = 0;
  let completedTasks = 0;
  let inProgressTasks = 0;

  db.projects.forEach(p => {
    (p.tasks || []).forEach(t => {
      totalTasks++;
      if (t.column === 'done' || t.completed) completedTasks++;
      if (t.column === 'in_progress') inProgressTasks++;
    });
  });

  const recentProjects = [...db.projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  res.json({
    workspace: db.workspace,
    stats: {
      totalProjects,
      totalFolders: db.folders.length,
      totalTasks,
      completedTasks,
      inProgressTasks,
      productivityRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    },
    recentProjects
  });
});

// 2. Pastas CRUD
app.get('/api/folders', (req, res) => {
  const db = loadDatabase();
  res.json(enrichFolders(db.folders, db.projects));
});

app.post('/api/folders', (req, res) => {
  const db = loadDatabase();
  const { name, parentId, icon, color, description } = req.body;
  if (!name) return res.status(400).json({ error: 'O nome da pasta é obrigatório' });

  const newFolder = {
    id: 'pasta-' + Date.now(),
    name: name.trim(),
    parentId: parentId || null,
    icon: icon || 'folder',
    color: color || '#10b981',
    description: description?.trim() || ''
  };

  db.folders.push(newFolder);
  saveDatabase(db);
  const enriched = enrichFolders(db.folders, db.projects);
  res.status(201).json(enriched.find(f => f.id === newFolder.id));
});

app.put('/api/folders/:id', (req, res) => {
  const db = loadDatabase();
  const index = db.folders.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Pasta não encontrada' });

  db.folders[index] = { ...db.folders[index], ...req.body };
  saveDatabase(db);
  const enriched = enrichFolders(db.folders, db.projects);
  res.json(enriched.find(f => f.id === req.params.id));
});

app.delete('/api/folders/:id', (req, res) => {
  const db = loadDatabase();
  const folderId = req.params.id;
  db.folders = db.folders.filter(f => f.id !== folderId && f.parentId !== folderId);
  db.projects = db.projects.map(p => (p.folderId === folderId ? { ...p, folderId: null } : p));
  saveDatabase(db);
  res.json({ success: true, remainingFolders: enrichFolders(db.folders, db.projects) });
});

// 3. Projetos CRUD
app.get('/api/projects', (req, res) => {
  const db = loadDatabase();
  const { folderId, search, category, status } = req.query;

  let results = [...db.projects];

  if (folderId && folderId !== 'all') {
    const childIds = db.folders.filter(f => f.parentId === folderId).map(f => f.id);
    const validFolderIds = [folderId, ...childIds];
    results = results.filter(p => validFolderIds.includes(p.folderId));
  }

  if (category && category !== 'Todas') {
    results = results.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== 'all') {
    results = results.filter(p => p.status?.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.author?.name && p.author.name.toLowerCase().includes(q)) ||
      (p.author?.email && p.author.email.toLowerCase().includes(q))
    );
  }

  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  res.json(results);
});

app.get('/api/projects/:id', (req, res) => {
  const db = loadDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const db = loadDatabase();
  const { title, folderId, category, status, priority, client, description, fileExtension } = req.body;
  if (!title) return res.status(400).json({ error: 'O título do projeto é obrigatório' });

  const now = new Date().toISOString();
  const ext = fileExtension || (title.includes('.') ? title.split('.').pop() : 'doc');

  const newProject = {
    id: 'proj-' + Date.now(),
    title: title.trim(),
    folderId: folderId || null,
    category: category || 'Software',
    status: status || 'Em Andamento',
    priority: priority || 'Média',
    author: {
      name: db.workspace.owner || 'Gabriel Silva',
      email: db.workspace.email || 'gabriel@consig.com.br',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    fileExtension: ext,
    fileSize: `${(Math.random() * 15 + 1).toFixed(1)} MB`,
    updatedAt: now,
    createdAt: now,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    client: client || 'Uso Pessoal',
    description: description?.trim() || '',
    starred: false,
    resources: [],
    notes: `# ${title}\n\nWorkspace criado em ${new Date().toLocaleDateString('pt-BR')}.\n\n### Metas Principais\n- [ ] Planejamento inicial\n- [ ] Execução das tarefas prioritárias\n- [ ] Revisão final e entrega`,
    tasks: [
      {
        id: 't-' + Date.now() + '-1',
        title: 'Definir escopo e requisitos',
        column: 'todo',
        priority: 'high',
        tags: ['Geral'],
        completed: false
      },
      {
        id: 't-' + Date.now() + '-2',
        title: 'Configurar ambiente e ferramentas',
        column: 'in_progress',
        priority: 'medium',
        tags: ['Setup'],
        completed: false
      }
    ],
    timeline: [
      {
        id: 'tl-' + Date.now(),
        action: `Criou o projeto "${title}"`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        user: db.workspace.owner || 'Gabriel Silva'
      }
    ]
  };

  db.projects.unshift(newProject);
  saveDatabase(db);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const db = loadDatabase();
  const index = db.projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Projeto não encontrado' });

  const updatedProject = {
    ...db.projects[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  if (req.body.status && req.body.status !== db.projects[index].status) {
    if (!updatedProject.timeline) updatedProject.timeline = [];
    updatedProject.timeline.unshift({
      id: 'tl-' + Date.now(),
      action: `Status alterado para "${req.body.status}"`,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      user: db.workspace.owner || 'Gabriel Silva'
    });
  }

  db.projects[index] = updatedProject;
  saveDatabase(db);
  res.json(updatedProject);
});

app.delete('/api/projects/:id', (req, res) => {
  const db = loadDatabase();
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  saveDatabase(db);
  res.json({ success: true });
});

// 4. Sub-endpoints de Tarefas do Projeto
app.post('/api/projects/:id/tasks', (req, res) => {
  const db = loadDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });

  const { title, description, column, priority, dueDate, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'O título da tarefa é obrigatório' });

  const newTask = {
    id: 't-' + Date.now(),
    title,
    description: description || '',
    column: column || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    tags: Array.isArray(tags) ? tags : ['Geral'],
    completed: column === 'done'
  };

  if (!project.tasks) project.tasks = [];
  project.tasks.push(newTask);
  project.updatedAt = new Date().toISOString();

  if (!project.timeline) project.timeline = [];
  project.timeline.unshift({
    id: 'tl-' + Date.now(),
    action: `Adicionou a tarefa "${title}"`,
    timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
    user: db.workspace.owner || 'Gabriel Silva'
  });

  saveDatabase(db);
  res.status(201).json({ task: newTask, project });
});

app.put('/api/projects/:id/tasks/:taskId', (req, res) => {
  const db = loadDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });

  const taskIndex = (project.tasks || []).findIndex(t => t.id === req.params.taskId);
  if (taskIndex === -1) return res.status(404).json({ error: 'Tarefa não encontrada' });

  const oldColumn = project.tasks[taskIndex].column;
  project.tasks[taskIndex] = {
    ...project.tasks[taskIndex],
    ...req.body
  };

  if (req.body.column === 'done') {
    project.tasks[taskIndex].completed = true;
  } else if (req.body.column && req.body.column !== 'done') {
    project.tasks[taskIndex].completed = false;
  }

  project.updatedAt = new Date().toISOString();

  if (req.body.column && req.body.column !== oldColumn) {
    if (!project.timeline) project.timeline = [];
    project.timeline.unshift({
      id: 'tl-' + Date.now(),
      action: `Moveu tarefa "${project.tasks[taskIndex].title}" para ${req.body.column}`,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      user: db.workspace.owner || 'Gabriel Silva'
    });
  }

  saveDatabase(db);
  res.json({ task: project.tasks[taskIndex], project });
});

app.delete('/api/projects/:id/tasks/:taskId', (req, res) => {
  const db = loadDatabase();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });

  project.tasks = (project.tasks || []).filter(t => t.id !== req.params.taskId);
  project.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json({ success: true, project });
});

// 5. Reset do Banco
app.post('/api/reset', (req, res) => {
  saveDatabase(initialData);
  res.json({ message: 'Banco de dados restaurado com sucesso.' });
});

app.listen(PORT, () => {
  console.log(`[Consig API] Servidor rodando em http://localhost:${PORT}`);
});
