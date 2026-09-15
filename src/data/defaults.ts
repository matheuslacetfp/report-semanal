import type { Activity, DashboardState, Stage, Task } from '../types';

const now = () => new Date().toISOString();
const task = (id: string, title: string): Task => ({ id, title, priority: 'media', labels: [], history: [] });

export const initialStages: Stage[] = [
  { id: 'todo', name: 'Em seguida', description: 'Próximas ações para destravar a operação', color: '#70a8ff', tasks: [task('todo-0', 'Validação de cadeia produtiva'), task('todo-1', 'Formatar saídas de formatos criativos'), task('todo-2', 'Acesso YouTube Analytics')] },
  { id: 'done', name: 'Ativo', description: 'Entregas em execução e em uso', color: '#4fd18b', tasks: [task('done-0', 'Estudo e definição de abordagem'), task('done-1', 'Criação de fluxo para mineração de conteúdo'), task('done-2', 'Criação de fluxo de edição'), task('done-3', 'Criação de script para transcrição'), task('done-4', 'Alimentar planilha de garimpo (recorrente)')] },
  { id: 'next', name: 'Concluído', description: 'Itens que entram no próximo ciclo', color: '#9b7cf4', tasks: [task('next-0', 'Concepção e criação de planilha para acompanhamento'), task('next-1', 'Refinar ingestão de dados a partir da validação de fluxo')] },
];

export const initialActivity: Activity[] = [
  { id: 'activity-1', icon: '✓', title: 'Script de transcrição concluído', detail: 'Entrega registrada hoje', at: now() },
  { id: 'activity-2', icon: '↗', title: 'Planilha de acompanhamento priorizada', detail: 'Próximo ciclo de trabalho', at: now() },
  { id: 'activity-3', icon: '•', title: 'Validação da cadeia produtiva', detail: 'Aguardando início', at: now() },
];

export const emptyState = (): DashboardState => ({ stages: structuredClone(initialStages), activity: structuredClone(initialActivity), monitoredFolders: [], version: 0, updatedAt: now() });
