import type { HTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export const TaskSkeletonList = (props: SkeletonProps) => {
  return (
    <div className="space-y-4" {...props}>
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl border p-5">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="mt-3 h-3 w-3/4" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

