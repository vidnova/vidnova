import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ecorally/ui';
import { Bell, LogOut, Plus, Settings, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex justify-end w-full items-center py-3 sticky top-0 right-0 backdrop-blur-md z-[1001]">
      <div className="flex items-center gap-4">
        <button className="cursor-pointer">
          <Bell className="text-muted-foreground hover:text-accent transition-colors" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-blue-400 p-2 rounded-full cursor-pointer text-white">KH</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <User className="text-accent" />
              <span>Профіль</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="text-accent" />
              <span>Створити подію</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="text-accent" />
              <span>Налаштування</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="text-accent" />
              <span>Вийти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
