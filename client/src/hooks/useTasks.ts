import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/api/client';
import type { Task } from '@/types';

interface TaskPayload {
  title: string;
  description?: string;
  dueDate: string;
  progress: 'not-started' | 'in-progress' | 'completed';
}

const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/tasks');
  return data.data;
};

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 60 * 1000,
  });

  const invalidateTasks = () => queryClient.invalidateQueries({ queryKey: ['tasks'] });

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskPayload) => api.post('/tasks', payload).then((res) => res.data.data),
    onSuccess: () => {
      toast.success('Task created');
      invalidateTasks();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaskPayload> }) =>
      api.put(`/tasks/${id}`, payload).then((res) => res.data.data),
    onSuccess: () => {
      toast.success('Task updated');
      invalidateTasks();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      toast.success('Task deleted');
      invalidateTasks();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });

  return {
    tasksQuery,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
};

