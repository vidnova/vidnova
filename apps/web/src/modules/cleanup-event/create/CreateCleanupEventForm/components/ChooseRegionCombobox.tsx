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
} from '@vidnova/ui';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export const ChooseRegionCombobox = () => {
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
          {'Виберіть область...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Введіть область..." />
          <CommandList>
            <CommandEmpty>Область не знайдена.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={'Дніпропетровська'}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                {'Дніпропетровська'}
                <Check
                  className={`ml-auto ${value === 'Дніпропетровська' ? 'opacity-100' : 'opacity-0'}`}
                />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
