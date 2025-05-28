interface EventDateProps {
  eventDate: string;
  eventTime: string;
}

export const EventDate = ({ eventDate, eventTime }: EventDateProps) => {
  return (
    <div className="bg-accent-foreground text-accent px-3 py-2 rounded-xl">{`${eventTime}, ${eventDate}`}</div>
  );
};
