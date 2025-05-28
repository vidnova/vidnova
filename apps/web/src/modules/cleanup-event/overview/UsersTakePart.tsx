import Image from "next/image";
import Link from "next/link";

export const UsersTakePart = () => {
  return (
    <section>
      <span className="text-xl font-bold text-accent">Візьмуть участь</span>
      <div className="flex flex-wrap gap-2 mt-3">
        {[...Array(12)].map((_, idx) => (
          <Link key={idx} href={"/profile/1"}>
            <Image
              src={"/test_user.jpg"}
              alt="User image"
              width={32}
              height={32}
              className="rounded-full w-7 h-7 object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};
