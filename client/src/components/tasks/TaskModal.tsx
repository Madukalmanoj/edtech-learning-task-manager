import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROGRESS_OPTIONS } from '@/lib/constants';
import type { Task } from '@/types';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    title: string;
    description?: string;
    dueDate: string;
    progress: Task['progress'];
  }) => Promise<void>;
  defaultValues?: Task;
  isSubmitting: boolean;
  canEditProgress: boolean;
}

const formatForInput = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export const TaskModal = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting,
  canEditProgress,
}: TaskModalProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    progress: 'not-started' as Task['progress'],
  });

  useEffect(() => {
    if (defaultValues) {
      setForm({
        title: defaultValues.title,
        description: defaultValues.description || '',
        dueDate: formatForInput(defaultValues.dueDate),
        progress: defaultValues.progress,
      });
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        progress: 'not-started',
      });
    }
  }, [defaultValues, open]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    };
    await onSubmit(payload);
    if (!defaultValues) {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        progress: 'not-started',
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Update task' : 'Create task'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Edit the fields and hit save to update your task.' : 'Tasks help learners stay accountable.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label requiredMark htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Add helpful context or resources…"
            />
          </div>
          <div className="space-y-2">
            <Label requiredMark htmlFor="dueDate">
              Due date
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>
          {canEditProgress && (
            <div className="space-y-2">
              <Label htmlFor="progress">Progress</Label>
              <Select
                value={form.progress}
                onValueChange={(value) => setForm((prev) => ({ ...prev, progress: value as Task['progress'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select progress" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRESS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : defaultValues ? 'Save changes' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

