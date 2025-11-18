import { Button } from '@/components/ui/button';
import { NotebookPen } from 'lucide-react';

interface TaskEmptyStateProps {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export const TaskEmptyState = ({ message, ctaLabel, onCta }: TaskEmptyStateProps) => (
  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
    <NotebookPen className="h-12 w-12 text-muted-foreground" />
    <p className="mt-4 text-muted-foreground">{message}</p>
    {ctaLabel && onCta && (
      <Button className="mt-6" onClick={onCta}>
        {ctaLabel}
      </Button>
    )}
  </div>
);

