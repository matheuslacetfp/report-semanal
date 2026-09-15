import { formatDateTime } from '../utils';
import type { Activity } from '../types';

export function ActivityPanel({ activity }: { activity: Activity[] }) { return <aside className="panel activity-panel"><div className="section-heading"><div><p className="eyebrow">Rastro de alterações</p><h2>Histórico recente</h2></div></div>{activity.length === 0 ? <div className="empty-state">Nenhuma alteração registrada.</div> : activity.map(item => <div className="update" key={item.id}><span className="update-icon">{item.icon}</span><div><strong>{item.title}</strong><small>{item.detail} · {formatDateTime(item.at)}</small></div></div>)}</aside>; }
