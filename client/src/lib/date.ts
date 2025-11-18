import { isPast, isWithinInterval, endOfWeek, startOfToday, parseISO } from 'date-fns';

export const formatDueDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const isTaskOverdue = (dateString: string) => isPast(new Date(dateString));

export const isTaskDueThisWeek = (dateString: string) => {
  const date = parseISO(dateString);
  const today = startOfToday();
  return isWithinInterval(date, {
    start: today,
    end: endOfWeek(today, { weekStartsOn: 1 }),
  });
};

