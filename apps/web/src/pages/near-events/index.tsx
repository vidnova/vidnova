import { CleanupEventsList } from '@/modules/cleanup-event/near';
import { MainLayout } from '@/modules/shared';

export default function Home() {
  return (
    <MainLayout>
      <h1 className="text-2xl text-accent mb-3">Останні події</h1>
      <CleanupEventsList />
    </MainLayout>
  );
}
