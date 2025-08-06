import { Bell, CalendarSearch, Earth, Map, MapPinPlus, PlusCircle, Send } from 'lucide-react';

export const generalSidebarLinks = [
  {
    icon: <Earth />,
    name: 'Головна',
    path: '/overview',
  },
];

export const eventsSidebarLinks = [
  {
    icon: <PlusCircle />,
    name: 'Створити подію',
    path: '/event/create',
  },
  {
    icon: <CalendarSearch />,
    name: 'Всі події',
    path: '/cleanup-events',
  },
];

export const pointsSidebarLinks = [
  {
    icon: <MapPinPlus />,
    name: 'Додати точку',
    path: '/point/create',
  },
  {
    icon: <Map />,
    name: 'Усі точки',
    path: '/point',
  },
];

export const personalSidebarLinks = [
  {
    icon: <Bell />,
    name: 'Сповіщення',
    path: '/notifications',
  },
  {
    icon: <Send />,
    name: 'Повідомлення',
    path: '/messages',
  },
];
