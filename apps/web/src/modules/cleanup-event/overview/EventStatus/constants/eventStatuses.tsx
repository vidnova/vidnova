import { Clock4, Circle, CircleX, CircleCheckBig } from "lucide-react";
import { JSX } from "react";

export type EventStatusType = "Planned" | "InProgress" | "Canceled" | "Completed";

export interface EventStatusConfig {
  status: EventStatusType;
  name: string;
  icon: JSX.Element;
  color: string;
}

export const eventStatuses: EventStatusConfig[] = [
  {
    status: "Planned",
    name: "Заплановано",
    icon: <Clock4 size={24} />,
    color: "text-yellow-300",
  },
  {
    status: "InProgress",
    name: "В процесі",
    icon: <Circle size={24} />,
    color: "text-green-300",
  },
  {
    status: "Canceled",
    name: "Скасовано",
    icon: <CircleX size={24} />,
    color: "text-red-400",
  },
  {
    status: "Completed",
    name: "Завершено",
    icon: <CircleCheckBig size={24} />,
    color: "text-green-400",
  },
];

export const getEventStatus = (status: EventStatusType) =>
  eventStatuses.find((s) => s.status === status);
