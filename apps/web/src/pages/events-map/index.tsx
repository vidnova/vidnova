import 'leaflet/dist/leaflet.css';
import { MainLayout } from '@/modules/shared';
import { AllEventsMap } from '@/modules/cleanup-event/map';

export default function EventsMap() {
  return (
    <MainLayout>
      <h1 className="text-accent text-2xl mb-6">Карта подій очищення</h1>
      <AllEventsMap />
    </MainLayout>
  );
}
