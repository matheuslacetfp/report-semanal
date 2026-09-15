import type { MonitoredFolder, Task } from './types';

export const formatDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(value));
export const formatDateTime = (value: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
export const validateUrl = (value: string): string | null => { if (!value.trim()) return 'Cole um link para continuar.'; try { const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`); if (!['http:', 'https:'].includes(url.protocol)) return 'Use um link que comece com http:// ou https://.'; return null; } catch { return 'Digite uma URL válida, como https://drive.google.com.'; } };
export const normalizeUrl = (value: string) => /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
export const domainIcon = (url: string) => { try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; } catch { return ''; } };
export const folderSort = (folders: MonitoredFolder[], sort: string) => [...folders].sort((a, b) => sort === 'recent' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt) : sort === 'name' ? a.name.localeCompare(b.name) : Number(b.favorite) - Number(a.favorite) || a.order - b.order);
const foldText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
export const taskMatches = (task: Task, query: string) => !query || foldText([task.title, task.assignee, ...task.labels].join(' ')).includes(foldText(query));
