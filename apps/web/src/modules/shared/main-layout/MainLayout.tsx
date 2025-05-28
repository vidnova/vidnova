import { ReactNode } from "react";
import { Header, Sidebar } from "./components";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="px-[128px]">
      <div className="flex w-full">
        <Sidebar />
        <div className="w-full">
          <Header />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </main>
  );
};
