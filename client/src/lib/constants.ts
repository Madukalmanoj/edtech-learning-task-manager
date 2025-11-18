import type { Progress } from '@/types';

export const PROGRESS_OPTIONS: { label: string; value: Progress }[] = [
  { label: 'Not started', value: 'not-started' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const DATE_FILTERS = [
  { label: 'All Dates', value: 'all' },
  { label: 'Due This Week', value: 'week' },
  { label: 'Overdue', value: 'overdue' },
];

