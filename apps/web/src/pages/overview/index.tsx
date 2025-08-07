import { CleanupEventsList } from '@/modules/cleanup-event/near';
import { ContaminatedPointsList } from '@/modules/contaminated-point';
import { MainLayout } from '@/modules/shared';
import { Button } from '@vidnova/ui';

export default function Home() {
  return (
    <MainLayout>
      <section className="mb-6">
        <div className={'flex justify-between items-center'}>
          <h2 className="text-2xl text-accent mb-3">Події очищення у вашому регіон</h2>
          <Button variant={'ghost'} size={'sm'}>
            Дивитись всі
          </Button>
        </div>
        <CleanupEventsList />
      </section>
      <section>
        <div className={'flex justify-between items-center'}>
          <h2 className="text-2xl text-accent mb-3">Забруднені місця поруч із вами</h2>
          <Button variant={'ghost'} size={'sm'}>
            Дивитись всі
          </Button>
        </div>
        <ContaminatedPointsList />
      </section>
    </MainLayout>
  );
}
