import { Input, Textarea } from '@ecorally/ui';
import {
  ChooseRegionCombobox,
  ChooseSettlementCombobox,
  CreateEventButton,
  CreatePointMap,
  EndEventDatePicker,
  InstrumentDialog,
  SelectImageInput,
  StartEventDatePicker,
} from './components';
import { ArrowRight } from 'lucide-react';

export const CreateCleanupEventForm = () => {
  return (
    <form>
      <div className="flex justify-between gap-6">
        <SelectImageInput />
        <div className="self-center text-muted-foreground text-sm items-center flex flex-col gap-2">
          <ArrowRight />
          <div className="text-center">Введіть дані</div>
        </div>
        <div className="w-full max-w-[300px] flex flex-col gap-3">
          <Input placeholder="Введіть назву..." />
          <Textarea placeholder="Введіть опис..." />
          <ChooseRegionCombobox />
          <ChooseSettlementCombobox />
          <InstrumentDialog />
          <StartEventDatePicker />
          <EndEventDatePicker />
        </div>
        <div className="self-center max-w-[92px] text-sm text-muted-foreground items-center flex flex-col gap-2">
          <ArrowRight />
          <div className="text-center">Поставте точку на карті</div>
        </div>
        <CreatePointMap />
      </div>
      <CreateEventButton />
    </form>
  );
};
