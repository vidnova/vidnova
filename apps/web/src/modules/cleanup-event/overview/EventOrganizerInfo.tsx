import Image from 'next/image';
import Link from 'next/link';

export const EventOrganizerInfo = () => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground">Організатор:</span>
      <Link href={'/profile/1'} className="flex items-center gap-2">
        <Image
          src={'/test_user.jpg'}
          className="w-8 h-8 object-cover rounded-full"
          alt="User photo"
          width={32}
          height={32}
        />
        <span className="text-accent">Test</span>
      </Link>
    </div>
  );
};
