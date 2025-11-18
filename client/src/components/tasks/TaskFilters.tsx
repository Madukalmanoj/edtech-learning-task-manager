import { DATE_FILTERS, PROGRESS_OPTIONS } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFiltersProps {
  progress: string;
  onProgressChange: (value: string) => void;
  date: string;
  onDateChange: (value: string) => void;
}

export const TaskFilters = ({ progress, onProgressChange, date, onDateChange }: TaskFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-48">
        <Select value={progress} onValueChange={onProgressChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {PROGRESS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-48">
        <Select value={date} onValueChange={onDateChange}>
          <SelectTrigger>
            <SelectValue placeholder="Date filter" />
          </SelectTrigger>
          <SelectContent>
            {DATE_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

