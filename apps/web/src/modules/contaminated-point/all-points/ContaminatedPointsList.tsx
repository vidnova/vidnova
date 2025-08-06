import { ContaminatedPointCard } from '../common';

export const ContaminatedPointsList = () => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {[...Array(10)].map((_, index) => (
        <ContaminatedPointCard key={index} />
      ))}
    </div>
  );
};
