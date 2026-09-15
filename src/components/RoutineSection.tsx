import { CalendarDays } from 'lucide-react';

const routine = [
  { day: 'Segunda', task: 'Daily / edição' },
  { day: 'Terça', task: 'Mineração' },
  { day: 'Quarta', task: 'Edição' },
  { day: 'Quinta', task: 'Mineração / ajustes' },
  { day: 'Sexta', task: 'Edição' },
];

export function RoutineSection() {
  const currentWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date()).replace('-feira', '');
  return <section className="routine-section" aria-labelledby="routine-title"><div className="section-heading"><div><p className="eyebrow">Calendário semanal</p><h2 id="routine-title">Rotina</h2><p>Agenda de atribuições da operação.</p></div><CalendarDays size={21} aria-hidden="true" /></div><div className="routine-calendar">{routine.map(item => <article className={`routine-day${item.day.toLowerCase() === currentWeekday ? ' is-today' : ''}`} key={item.day}><h3>{item.day}</h3><div className="routine-task">{item.task}</div></article>)}</div></section>;
}
