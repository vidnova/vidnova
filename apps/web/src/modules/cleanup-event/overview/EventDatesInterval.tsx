import { Calendar } from 'lucide-react';

interface EventDatesIntervalProps {
  startDate: string;
  endDate: string;
}

export const EventDatesInterval = ({ startDate, endDate }: EventDatesIntervalProps) => {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Calendar />
      <span>
        З {startDate} по {endDate}
      </span>
    </div>
  );
};
