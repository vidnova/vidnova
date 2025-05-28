import {
  CleanupEventsList,
  CleanupEventsPagination,
  FilterPopover,
} from '@/modules/cleanup-event/all-events';
import { MainLayout } from '@/modules/shared';
import { Input } from '@ecorally/ui';

export default function CleanupEvents() {
  return (
    <MainLayout>
      <h1 className="text-2xl text-accent mb-3">Всі події</h1>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Input placeholder="Введіть назву події" className="max-w-[600px]" />
          <FilterPopover />
        </div>
        <CleanupEventsList />
        <CleanupEventsPagination totalPages={3} currentPage={1} onPageChange={() => {}} />
      </div>
    </MainLayout>
  );
}
