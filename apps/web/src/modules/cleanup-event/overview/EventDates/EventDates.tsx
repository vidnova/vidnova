import { EventDate } from "./components";

export const EventDates = () => {
  return (
    <div>
      <span className="text-xl font-bold text-accent">Дати проведення</span>
      <div className="flex flex-wrap gap-3 max-w-[400px] mt-3">
        {[...Array(5)].map((_, index) => (
          <EventDate key={index} eventTime="12:30" eventDate="10.05.2025" />
        ))}
      </div>
    </div>
  );
};
