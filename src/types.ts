export type StageId = 'todo' | 'done' | 'next';
export type Priority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  priority: Priority;
  labels: string[];
  history: TaskHistory[];
}

export interface TaskHistory {
  id: string;
  action: string;
  detail: string;
  at: string;
}

export interface Stage {
  id: StageId;
  name: string;
  description: string;
  color: string;
  tasks: Task[];
}

export interface Activity {
  id: string;
  icon: string;
  title: string;
  detail: string;
  at: string;
}

export interface MonitoredFolder {
  id: string;
  name: string;
  url: string;
  category: string;
  favorite: boolean;
  order: number;
  updatedAt: string;
}

export interface DashboardState {
  stages: Stage[];
  activity: Activity[];
  monitoredFolders: MonitoredFolder[];
  version: number;
  updatedAt: string;
}

export type SyncStatus = 'Local' | 'Carregando...' | 'Salvando...' | 'Sincronizado' | 'Offline' | 'Conflito' | 'Erro ao salvar';
