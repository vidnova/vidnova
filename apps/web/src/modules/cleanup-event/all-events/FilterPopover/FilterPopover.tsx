import { Popover, PopoverContent, PopoverTrigger } from '@vidnova/ui';
import {
  EndEventDatePicker,
  RegionCombobox,
  SettlementCombobox,
  StartEventDatePicker,
} from './components';
import { Filter } from 'lucide-react';

export const FilterPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-accent hover:bg-secondary p-3 cursor-pointer rounded-full">
          <Filter />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full flex flex-col gap-3">
        <RegionCombobox />
        <SettlementCombobox />
        <div className="flex items-center gap-2">
          <StartEventDatePicker />
          <span className="text-accent">-</span>
          <EndEventDatePicker />
        </div>
      </PopoverContent>
    </Popover>
  );
};
