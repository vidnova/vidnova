import { ChartBar, Earth, Map, Plus, Search, User } from "lucide-react";

export const sidebarLinks = [
  {
    icon: <Earth />,
    name: "Події недалеко",
    path: "/near-events",
  },
  {
    icon: <Map />,
    name: "Карта подій",
    path: "/events-map",
  },
  {
    icon: <Search />,
    name: "Всі події",
    path: "/cleanup-events",
  },
  {
    icon: <Plus />,
    name: "Створити подію",
    path: "/event/create",
  },
  {
    icon: <User />,
    name: "Мій профіль",
    path: "/in-development",
  },
  {
    icon: <ChartBar />,
    name: "Статистика додатку",
    path: "/in-development",
  },
];
