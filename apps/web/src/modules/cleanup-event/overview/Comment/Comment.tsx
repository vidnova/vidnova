import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ecorally/ui';
import { Edit, EllipsisVertical, MessageSquareWarning, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Comment = ({ onClickOpenReply }: { onClickOpenReply: () => void }) => {
  return (
    <div className="flex text-accent gap-3">
      <Link href={'/profile'}>
        <Image
          src={'/test_user.jpg'}
          alt="User image"
          className="w-11 h-11 object-cover rounded-full"
          width={44}
          height={44}
        />
      </Link>
      <div className="w-full">
        <div className="flex justify-between">
          <Link href={'/profile'}>
            <span className="font-bold">Олег</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer">
                <EllipsisVertical />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="text-accent" />
                <span>Змінити</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareWarning className="text-accent" />
                <span>Поскаржитись</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="text-accent" />
                <span>Видалити</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>Візьму участь!</div>
        <div className="mt-2">
          <Button size={'sm'} variant={'ghost'} onClick={onClickOpenReply}>
            Відповісти
          </Button>
        </div>
      </div>
    </div>
  );
};
