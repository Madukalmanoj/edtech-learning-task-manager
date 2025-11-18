import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskModal } from '@/components/tasks/TaskModal';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskEmptyState } from '@/components/tasks/TaskEmptyState';
import { TaskSkeletonList } from '@/components/tasks/TaskSkeleton';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types';
import { isTaskDueThisWeek, isTaskOverdue } from '@/lib/date';

const applyFilters = (tasks: Task[], progressFilter: string, dateFilter: string) => {
  return tasks.filter((task) => {
    const matchesProgress = progressFilter === 'all' || task.progress === progressFilter;
    if (!matchesProgress) return false;

    if (dateFilter === 'week') {
      return isTaskDueThisWeek(task.dueDate);
    }
    if (dateFilter === 'overdue') {
      return isTaskOverdue(task.dueDate) && task.progress !== 'completed';
    }
    return true;
  });
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasksQuery, createTask, updateTask, deleteTask, isCreating, isUpdating } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [progressFilter, setProgressFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [teacherTab, setTeacherTab] = useState<'owner' | 'students'>('owner');

  const tasks = tasksQuery.data ?? [];

  const filteredTasks = useMemo(
    () => applyFilters(tasks, progressFilter, dateFilter),
    [tasks, progressFilter, dateFilter]
  );

  const myTasks = filteredTasks.filter((task) => task.ownership === 'owner');
  const studentTasks = filteredTasks.filter((task) => task.ownership === 'assigned-student');

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleProgressChange = async (taskId: string, progress: Task['progress']) => {
    await updateTask({ id: taskId, payload: { progress } });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(taskId);
  };

  const handleSubmit = async (payload: {
    title: string;
    description?: string;
    dueDate: string;
    progress: Task['progress'];
  }) => {
    if (editingTask) {
      await updateTask({ id: editingTask._id, payload });
    } else {
      await createTask(payload);
    }
  };

  const canEditProgress = editingTask ? editingTask.ownership === 'owner' : true;

  const renderTaskGrid = (items: Task[], showEmptyCta: boolean) => {
    if (tasksQuery.isLoading) {
      return <TaskSkeletonList />;
    }

    if (!items.length) {
      return (
        <TaskEmptyState
          message="No tasks match your filters."
          ctaLabel={showEmptyCta ? 'Add your first task' : undefined}
          onCta={showEmptyCta ? openCreateModal : undefined}
        />
      );
    }

    return (
      <div className="grid gap-4">
        {items.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isOwner={task.ownership === 'owner'}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onProgressChange={handleProgressChange}
          />
        ))}
      </div>
    );
  };

  const studentView = user?.role === 'student';

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Track learning with clarity</p>
            <h1 className="text-2xl font-semibold">Tasks</h1>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add task
          </Button>
        </div>

        <TaskFilters
          progress={progressFilter}
          date={dateFilter}
          onProgressChange={setProgressFilter}
          onDateChange={setDateFilter}
        />

        {studentView ? (
          renderTaskGrid(myTasks, true)
        ) : (
          <Tabs value={teacherTab} onValueChange={(value) => setTeacherTab(value as 'owner' | 'students')}>
            <TabsList>
              <TabsTrigger value="owner">My Tasks</TabsTrigger>
              <TabsTrigger value="students">Student Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="owner">{renderTaskGrid(myTasks, true)}</TabsContent>
            <TabsContent value="students">{renderTaskGrid(studentTasks, false)}</TabsContent>
          </Tabs>
        )}
      </div>

      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultValues={editingTask}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
        canEditProgress={canEditProgress}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;

