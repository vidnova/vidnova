import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@ecorally/ui';

export const StartEventDatePicker = () => {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'}>
          <CalendarIcon />
          {date ? format(date, 'PPP') : <span>Оберіть дату початку</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
