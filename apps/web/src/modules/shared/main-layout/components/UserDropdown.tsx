import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ecorally/ui';
import { ShieldQuestion, LogOut, Settings, User } from 'lucide-react';

export const UserDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center text-start gap-3 cursor-pointer w-full hover:bg-primary-foreground rounded-lg p-2 mb-6">
          <div className="bg-blue-400 w-10 h-10 p-2 rounded-full text-white flex items-center justify-center">
            KH
          </div>
          <div className="flex flex-col">
            <span className="font-normal">Kyrylo</span>
            <span className="font-light text-muted-foreground">Учасник з 2025 року</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <User className="text-accent" />
          <span>Профіль</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="text-accent" />
          <span>Налаштування</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShieldQuestion className="text-accent" />
          <span>Задати питання</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="text-accent" />
          <span>Вийти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
