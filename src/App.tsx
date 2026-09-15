import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Cloud, CloudOff, Database, LayoutDashboard } from 'lucide-react';
import { ActivityPanel } from './components/ActivityPanel';
import { FolderSection } from './components/FolderSection';
import { HealthPanel } from './components/HealthPanel';
import { RoutineSection } from './components/RoutineSection';
import { TaskBoard } from './components/TaskBoard';
import { emptyState } from './data/defaults';
import { fetchDashboard, flushQueue, saveDashboard, subscribeDashboard } from './services/dashboardService';
import { createBackup, readLocalState, writeLocalState } from './services/storage';
import type { Activity as ActivityItem, DashboardState, SyncStatus } from './types';

const now = () => new Date().toISOString();
export default function App() {
  const [state, setState] = useState<DashboardState>(() => readLocalState());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(import.meta.env.VITE_SUPABASE_URL ? 'Carregando...' : 'Local');
  const [toast, setToast] = useState('');
  const hydrated = useRef(false);
  const currentDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
  const totalTasks = useMemo(() => state.stages.reduce((total, stage) => total + stage.tasks.length, 0), [state.stages]);
  const completed = state.stages.find(stage => stage.id === 'next')?.tasks.length || 0;
  const progress = totalTasks ? Math.round(completed / totalTasks * 100) : 0;
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3000); };
  const record = (title: string, icon = '•'): ActivityItem => ({ id: `activity-${Date.now()}`, icon, title, detail: 'Alteração registrada agora', at: now() });
  const update = (patch: Partial<DashboardState>, activity?: ActivityItem) => { setState(current => ({ ...current, ...patch, activity: activity ? [activity, ...current.activity].slice(0, 12) : current.activity, version: current.version + 1, updatedAt: now() })); };

  useEffect(() => { let active = true; fetchDashboard().then(remote => { if (active && remote) setState(current => remote.version >= current.version ? remote : current); setSyncStatus(navigator.onLine ? 'Sincronizado' : 'Offline'); }).catch(() => setSyncStatus('Offline')); const unsubscribe = subscribeDashboard(remote => { setState(current => remote.version > current.version ? remote : current); setSyncStatus('Sincronizado'); }); const online = () => { setSyncStatus('Salvando...'); void flushQueue().then(() => setSyncStatus('Sincronizado')).catch(() => setSyncStatus('Erro ao salvar')); }; window.addEventListener('online', online); hydrated.current = true; return () => { active = false; unsubscribe?.(); window.removeEventListener('online', online); }; }, []);
  useEffect(() => { if (!hydrated.current) return; writeLocalState(state); createBackup(state); const timer = window.setTimeout(() => { if (!import.meta.env.VITE_SUPABASE_URL || !navigator.onLine) { setSyncStatus(navigator.onLine ? 'Local' : 'Offline'); return; } setSyncStatus('Salvando...'); saveDashboard(state).then(() => setSyncStatus('Sincronizado')).catch(error => setSyncStatus(error instanceof Error && error.message === 'CONFLICT' ? 'Conflito' : 'Erro ao salvar')); }, 500); return () => window.clearTimeout(timer); }, [state]);
  const updateFolders = (folders: DashboardState['monitoredFolders']) => update({ monitoredFolders: folders }, record('Pastas monitoradas atualizadas', '↗'));
  const updateStages = (stages: DashboardState['stages']) => update({ stages }, record('Quadro de tarefas atualizado', '✓'));
  const statusLabel = syncStatus === 'Offline' ? 'Offline · alterações serão sincronizadas depois' : syncStatus === 'Conflito' ? 'Conflito · estado remoto mais recente detectado' : syncStatus;
  return <main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark"><LayoutDashboard size={20} /></span><span>Geração de ADS</span></div><div className="topbar-meta"><span>Visão geral · {currentDate}</span><span className="sync-status" role="status">{syncStatus === 'Offline' ? <CloudOff size={13} /> : <Cloud size={13} />} {statusLabel}</span></div></header><section className="hero"><div><p className="eyebrow">Fluxo de entrega</p><h1>Da ideia ao conteúdo.</h1><p className="hero-copy">Um mapa vivo das entregas de produção, com clareza sobre responsabilidades, acessos e próximos movimentos.</p></div><div className="hero-side"><div className="hero-side-head"><span>Progresso do fluxo</span><span>{completed} de {totalTasks} itens</span></div><strong>{progress}%</strong><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><div className="progress-meta"><span>Início da operação</span><span>Próximo ciclo</span></div></div></section><RoutineSection /><section className="kpis"><div className="kpi"><span>Itens no fluxo</span><strong>{totalTasks}</strong><small>100%</small></div><div className="kpi"><span>Em seguida</span><strong>{state.stages[0]?.tasks.length || 0}</strong><small>Próximas ações</small></div><div className="kpi"><span>Ativo</span><strong>{state.stages[1]?.tasks.length || 0}</strong><small>Em execução</small></div><div className="kpi"><span>Links monitorados</span><strong>{state.monitoredFolders.length}</strong><small>Acesso rápido</small></div></section><FolderSection folders={state.monitoredFolders} onChange={updateFolders} onNotify={notify} /><TaskBoard stages={state.stages} onChange={updateStages} onNotify={notify} /><section className="details"><HealthPanel stages={state.stages} totalTasks={totalTasks} /><ActivityPanel activity={state.activity} /><div className="panel reliability"><div className="section-heading"><div><p className="eyebrow">Confiabilidade</p><h2>Estado do sistema</h2></div><Database size={20} /></div><p>Backups locais: últimos 10 estados</p><p>Sincronização: {statusLabel}</p><p>Fila offline: pronta para reconectar</p></div></section><footer className="footer">Painel de acompanhamento da produção · dados protegidos localmente</footer>{toast && <div className="toast" role="status"><Activity size={16} /> {toast}</div>}</main>;
}
