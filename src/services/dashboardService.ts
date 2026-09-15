import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { clearQueue, enqueueState, readQueue } from './storage';
import { normalizeState } from './storage';
import type { DashboardState } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://zdqgugplqtnjysktfntb.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZfmVSafEvd8N1kAZdHUbdQ_C_uTqqrO';
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

const toRow = (state: DashboardState) => ({ id: 'main', stages: state.stages, activity: state.activity, monitored_folders: state.monitoredFolders, version: state.version, updated_at: state.updatedAt });
const fromRow = (row: Record<string, unknown>): DashboardState => normalizeState({ stages: row.stages as DashboardState['stages'], activity: row.activity as DashboardState['activity'], monitoredFolders: row.monitored_folders as DashboardState['monitoredFolders'], version: Number(row.version || 0), updatedAt: String(row.updated_at || new Date().toISOString()) });

export async function fetchDashboard(): Promise<DashboardState | null> {
  if (!supabase) return null;
  let result = await supabase.from('dashboard_state').select('stages, activity, monitored_folders, version, updated_at').eq('id', 'main').maybeSingle();
  if (result.error?.code === 'PGRST204') result = await supabase.from('dashboard_state').select('stages, activity, monitored_folders, updated_at').eq('id', 'main').maybeSingle();
  const { data, error } = result;
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function saveDashboard(state: DashboardState): Promise<void> {
  if (!supabase || !navigator.onLine) { enqueueState(state); return; }
  const versionResult = await supabase.from('dashboard_state').select('version').eq('id', 'main').maybeSingle();
  const remote = versionResult.data;
  if (remote?.version && Number(remote.version) > state.version) throw new Error('CONFLICT');
  let result = await supabase.from('dashboard_state').upsert(toRow(state));
  if (result.error?.code === 'PGRST204') result = await supabase.from('dashboard_state').upsert({ id: 'main', stages: state.stages, activity: state.activity, monitored_folders: state.monitoredFolders, updated_at: state.updatedAt });
  if (result.error) throw result.error;
  clearQueue();
}

export async function flushQueue(): Promise<void> {
  for (const state of readQueue()) await saveDashboard(state);
  clearQueue();
}

export function subscribeDashboard(onState: (state: DashboardState) => void, onStatus?: (status: string) => void): (() => void) | undefined {
  if (!supabase) return undefined;
  const channel = supabase.channel('dashboard-state-sync').on('postgres_changes', { event: '*', schema: 'public', table: 'dashboard_state', filter: 'id=eq.main' }, payload => { if (payload.new) onState(fromRow(payload.new as Record<string, unknown>)); }).subscribe(status => onStatus?.(status));
  return () => { void supabase.removeChannel(channel); };
}
