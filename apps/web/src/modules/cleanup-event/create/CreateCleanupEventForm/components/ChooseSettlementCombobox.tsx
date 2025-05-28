import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ecorally/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export const ChooseSettlementCombobox = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {'Виберіть місто...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Введіть місто..." />
          <CommandList>
            <CommandEmpty>Місто не знайдено.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={'Дніпро'}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                {'Дніпро'}
                <Check className={`ml-auto ${value === 'Дніпро' ? 'opacity-100' : 'opacity-0'}`} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
