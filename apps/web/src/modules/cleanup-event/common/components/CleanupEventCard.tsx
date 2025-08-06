import { Calendar, MapPin, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@ecorally/ui';

export const CleanupEventCard = () => {
  return (
    <Link
      href={'/event/1'}
      className="rounded-xl overflow-hidden relative bg-primary-foreground hover:bg-primary-foreground/70 p-3 transition-colors"
    >
      <Badge className={'absolute left-4 top-4'}>Активно</Badge>
      <Image
        className="w-full rounded-md mb-2"
        src={'/test.jpg'}
        width={200}
        height={100}
        alt={'name'}
      />
      <div className={'flex flex-col gap-1'}>
        <div className="text-accent text-xl truncate">Cleanup event</div>
        <div className="text-muted-foreground flex gap-1">
          <MapPin />
          <p className="truncate">Дніпро, Дніпропетровська область</p>
        </div>
        <div className="text-muted-foreground flex gap-1">
          <Calendar size={20} />
          <p className="truncate">06.08.2025 - 10.08.2025</p>
        </div>
        <div className="text-muted-foreground flex gap-1">
          <User size={20} />
          <p className="truncate">Кирило Глєбов</p>
        </div>
      </div>
    </Link>
  );
};
