import {
  EventDates,
  EventDatesInterval,
  EventDescription,
  EventImage,
  EventOrganizerInfo,
  EventStatus,
  InstrumentsList,
  PointMap,
  TakePartButton,
  UsersTakePart,
  CreateCommentForm,
  Comment,
  CreateCommentReplyForm,
} from '@/modules/cleanup-event/overview';
import { MainLayout } from '@/modules/shared';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

export default function EventPage() {
  const [openedReplyId, setOpenedReplyId] = useState<number | null>(null);

  const handleOpenCreateReply = (commentId: number) => {
    setOpenedReplyId(commentId);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <EventImage imageUrl="/test.jpg" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-accent">Подія 1</h1>
            <TakePartButton isTaken={false} />
          </div>
          <EventOrganizerInfo />
        </div>
        <div className="flex flex-col gap-3">
          <EventStatus status="Planned" />
          <EventDatesInterval startDate="11.05.2025" endDate="21.05.2025" />
          <EventDescription />
        </div>
        <div className="flex justify-between">
          <PointMap />
          <InstrumentsList />
          <EventDates />
        </div>
        <UsersTakePart />
        <span className="text-xl font-bold text-accent">Коментарі</span>
        <CreateCommentForm />
        <div className="mt-3 flex flex-col gap-3">
          {[...Array(2)].map((_, idx) => (
            <div key={idx}>
              <Comment onClickOpenReply={() => handleOpenCreateReply(idx)} key={idx} />
              <div className="ml-14 mt-3">
                {openedReplyId === idx && (
                  <CreateCommentReplyForm onClickClose={() => setOpenedReplyId(null)} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
