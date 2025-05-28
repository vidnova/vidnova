import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const CleanupEventCard = () => {
  return (
    <Link
      href={"/event/1"}
      className="rounded-xl overflow-hidden bg-primary-foreground hover:bg-primary-foreground/70 p-3 transition-colors"
    >
      <Image
        className="w-full rounded-md mb-2"
        src={"/test.jpg"}
        width={200}
        height={100}
        alt={"name"}
      />
      <div className="text-accent text-xl truncate">Cleanup event</div>
      <div className="text-muted-foreground flex gap-1">
        <MapPin />
        <p className="truncate">Дніпро, Дніпропетровська область</p>
      </div>
    </Link>
  );
};
