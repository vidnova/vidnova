import Link from 'next/link';
import { sidebarLinks } from '../constants/index';
import { useRouter } from 'next/router';

export const Sidebar = () => {
  const { pathname } = useRouter();

  return (
    <aside className="sticky top-0 left-0 h-screen w-[300px] py-6">
      <Link href={'/near-events'} className="gradient-logo text-2xl font-bold">
        EcoRally
      </Link>
      <div className="mt-7">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`w-full flex items-center gap-2 group rounded-lg p-2 ${
                isActive ? 'text-accent bg-primary-foreground' : 'text-muted-foreground'
              } hover:bg-primary-foreground hover:text-accent transition-colors`}
            >
              {link.icon}
              <div>{link.name}</div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
