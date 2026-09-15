import { emptyState } from '../data/defaults';
import type { DashboardState, MonitoredFolder, Stage, Task } from '../types';

const STATE_KEY = 'fluxo-dashboard-state';
const OLD_KEYS = { stages: 'fluxo-stages', activity: 'fluxo-activity', folders: 'fluxo-folders' };
const QUEUE_KEY = 'fluxo-sync-queue';
const BACKUP_KEY = 'fluxo-dashboard-backups';

const asTask = (value: unknown, index: number, stageId: string): Task => {
  const source = typeof value === 'string' ? { title: value } : (value as Partial<Task> || {});
  return { id: source.id || `${stageId}-${index}`, title: source.title || 'Tarefa sem título', assignee: source.assignee || '', dueDate: source.dueDate || '', priority: source.priority || 'media', labels: Array.isArray(source.labels) ? source.labels : [], history: Array.isArray(source.history) ? source.history : [] };
};

export const normalizeState = (input: Partial<DashboardState> | null | undefined): DashboardState => {
  const fallback = emptyState();
  const stages = Array.isArray(input?.stages) && input.stages.length ? input.stages.map((stage, index) => ({
    ...fallback.stages[index % fallback.stages.length], ...stage,
    id: stage.id || fallback.stages[index % fallback.stages.length].id,
    tasks: Array.isArray(stage.tasks) ? stage.tasks.map((item, taskIndex) => asTask(item, taskIndex, stage.id || `stage-${index}`)) : [],
  })) : fallback.stages;
  const folders = Array.isArray(input?.monitoredFolders) ? input.monitoredFolders : [];
  return { stages, activity: Array.isArray(input?.activity) ? input.activity : fallback.activity, monitoredFolders: folders.map((folder, index) => ({ id: folder.id || `folder-${index}`, name: folder.name || folder.url, url: folder.url, category: folder.category || 'Outro', favorite: Boolean(folder.favorite), order: folder.order ?? index, updatedAt: folder.updatedAt || new Date().toISOString() })), version: input?.version || 0, updatedAt: input?.updatedAt || new Date().toISOString() };
};

export const readLocalState = (): DashboardState => {
  try {
    const current = localStorage.getItem(STATE_KEY);
    if (current) return normalizeState(JSON.parse(current));
    const legacy = { stages: JSON.parse(localStorage.getItem(OLD_KEYS.stages) || 'null'), activity: JSON.parse(localStorage.getItem(OLD_KEYS.activity) || 'null'), monitoredFolders: JSON.parse(localStorage.getItem(OLD_KEYS.folders) || 'null') };
    const state = normalizeState(legacy);
    writeLocalState(state);
    return state;
  } catch { return emptyState(); }
};

export const writeLocalState = (state: DashboardState): void => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  localStorage.setItem(OLD_KEYS.stages, JSON.stringify(state.stages));
  localStorage.setItem(OLD_KEYS.activity, JSON.stringify(state.activity));
  localStorage.setItem(OLD_KEYS.folders, JSON.stringify(state.monitoredFolders));
};

export const createBackup = (state: DashboardState): void => {
  const backups = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]') as DashboardState[];
  localStorage.setItem(BACKUP_KEY, JSON.stringify([{ ...state }, ...backups].slice(0, 10)));
};

export const readQueue = (): DashboardState[] => JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
export const enqueueState = (state: DashboardState): void => localStorage.setItem(QUEUE_KEY, JSON.stringify([...readQueue(), state].slice(-10)));
export const clearQueue = (): void => localStorage.removeItem(QUEUE_KEY);
