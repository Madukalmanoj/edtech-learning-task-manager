import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROGRESS_OPTIONS } from '@/lib/constants';
import { formatDueDate, isTaskOverdue } from '@/lib/date';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onProgressChange: (taskId: string, progress: Task['progress']) => void;
  isOwner: boolean;
}

export const TaskCard = ({ task, onEdit, onDelete, onProgressChange, isOwner }: TaskCardProps) => {
  const overdue = isTaskOverdue(task.dueDate) && task.progress !== 'completed';

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-panel rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              {task.ownership === 'assigned-student' && (
                <Badge variant="outline" className="text-xs capitalize">
                  {task.userId.email}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{task.description || 'No description provided.'}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => onDelete(task._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={cn(overdue && 'text-destructive font-semibold')}>
              {formatDueDate(task.dueDate)} {overdue && '(Overdue)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Progress</span>
            {isOwner ? (
              <Select value={task.progress} onValueChange={(value) => onProgressChange(task._id, value as Task['progress'])}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROGRESS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="capitalize">
                {task.progress.replace('-', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

