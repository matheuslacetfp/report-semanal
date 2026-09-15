import { describe, expect, it } from 'vitest';
import { folderSort, normalizeUrl, taskMatches, validateUrl } from './utils';

describe('dashboard domain helpers', () => {
  it('validates and normalizes URLs with actionable errors', () => { expect(validateUrl('')).toContain('Cole'); expect(validateUrl('drive.google.com')).toBeNull(); expect(normalizeUrl('drive.google.com')).toBe('https://drive.google.com'); });
  it('filters tasks and sorts favorite folders first', () => { expect(taskMatches({ id: '1', title: 'YouTube', priority: 'media', labels: ['vídeo'], history: [] }, 'video')).toBe(true); const folders = [{ id: 'a', name: 'A', url: '', category: 'Outro', favorite: false, order: 0, updatedAt: '2024-01-01' }, { id: 'b', name: 'B', url: '', category: 'Drive', favorite: true, order: 1, updatedAt: '2024-01-01' }]; expect(folderSort(folders, 'favorite')[0].id).toBe('b'); });
});
