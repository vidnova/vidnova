import React from 'react';
import { MainBreadcrumb, Sidebar } from './components';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="px-[128px]">
      <div className="flex w-full">
        <Sidebar />
        <div className="w-full p-6 flex flex-col gap-4">
          <MainBreadcrumb />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
};
