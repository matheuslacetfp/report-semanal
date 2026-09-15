import type { Stage } from '../types';

type Props = { stages: Stage[]; totalTasks: number };

export function HealthPanel({ stages, totalTasks }: Props) {
  return <div className="panel health-panel"><div className="section-heading"><div><p className="eyebrow">Visão operacional</p><h2>Saúde do fluxo</h2><p>Distribuição atual das tarefas por etapa.</p></div></div><div className="health-list">{stages.map(stage => { const percentage = totalTasks ? Math.round(stage.tasks.length / totalTasks * 100) : 0; return <div className="health-row" key={stage.id}><div className="health-label"><span><i style={{ background: stage.color }} />{stage.name}</span><strong>{stage.tasks.length} · {percentage}%</strong></div><div className="health-track"><div className="health-fill" style={{ width: `${percentage}%`, background: stage.color }} /></div></div>; })}</div></div>;
}
