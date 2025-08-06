import { CleanupEventCard } from '../common';

export const CleanupEventsList = () => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[...Array(10)].map((_, index) => (
        <CleanupEventCard key={index} />
      ))}
    </div>
  );
};
