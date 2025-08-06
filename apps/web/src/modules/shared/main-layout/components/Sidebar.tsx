import Link from 'next/link';
import { eventsSidebarLinks, generalSidebarLinks, personalSidebarLinks, pointsSidebarLinks } from '../constants/index';
import { useRouter } from 'next/router';
import { UserDropdown } from '@/modules/shared/main-layout/components/UserDropdown';

export const Sidebar = () => {
  const { pathname } = useRouter();

  return (
    <aside className="sticky top-0 left-0 h-screen w-[300px] py-6">
      <Link href={'/overview'} className="gradient-logo text-2xl font-light">
        VIDNOVA
      </Link>
      <div className="flex flex-col justify-between h-full">
        <div className="mt-7">
          <div className="ml-2 text-xs py-2">ГОЛОВНЕ</div>
          <div>
            {generalSidebarLinks.map((link) => {
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
          <div className="ml-2 text-xs py-2">ПОДІЇ ОЧИЩЕННЯ</div>
          <div>
            {eventsSidebarLinks.map((link) => {
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
          <div className="ml-2 text-xs py-2">ЗАБРУДНЕНІ ТОЧКИ</div>
          <div>
            {pointsSidebarLinks.map((link) => {
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
          <div className="ml-2 text-xs py-2">ПЕРСОНАЛЬНЕ</div>
          <div>
            {personalSidebarLinks.map((link) => {
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
        </div>
        <UserDropdown />
      </div>
    </aside>
  );
};
