import { beforeEach, describe, expect, it } from 'vitest';
import { emptyState } from '../data/defaults';
import { normalizeState } from './storage';

describe('dashboard storage normalization', () => {
  beforeEach(() => localStorage.clear());
  it('migrates legacy string tasks and folder fields', () => {
    const state = normalizeState({ stages: [{ id: 'todo', name: 'Em seguida', description: '', color: '#fff', tasks: ['Uma tarefa'] } as never], monitoredFolders: [{ url: 'https://drive.google.com', name: 'Drive' } as never] });
    expect(state.stages[0].tasks[0].title).toBe('Uma tarefa');
    expect(state.stages[0].tasks[0].priority).toBe('media');
    expect(state.monitoredFolders[0].category).toBe('Outro');
  });
  it('keeps a safe default state for invalid input', () => { expect(normalizeState(null).stages).toHaveLength(emptyState().stages.length); });
});
