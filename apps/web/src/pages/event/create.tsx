import { CreateCleanupEventForm } from '@/modules/cleanup-event/create';
import { MainLayout } from '@/modules/shared';
import 'leaflet/dist/leaflet.css';

export default function CreateEvent() {
  return (
    <MainLayout>
      <h1 className="text-2xl text-accent mb-6">Створити подію очищення</h1>
      <CreateCleanupEventForm />
    </MainLayout>
  );
}
