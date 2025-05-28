import { getEventStatus, EventStatusType } from './constants/eventStatuses';

interface EventStatusProps {
  status: EventStatusType;
}

export const EventStatus = ({ status }: EventStatusProps) => {
  const config = getEventStatus(status);

  if (!config) return null;

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      {config.icon}
      <span>{config.name}</span>
    </div>
  );
};
