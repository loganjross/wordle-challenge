import { createContext, useContext, useState } from "react";

export const NOTIFICATION_DURATION_MS = 3000;

export interface Notification {
  id: number;
  message: string;
}

const NotificationsContext = createContext<{
  notifications: Notification[];
  addNotification: (notification: string) => void;
  removeNotification: (notificationId: number) => void;
}>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  function addNotification(notification: string) {
    setNotifications((notifications) => [
      ...notifications,
      {
        id: notifications.length,
        message: notification,
      },
    ]);
  }

  function removeNotification(notificationId: number) {
    setNotifications((notifications) =>
      notifications.filter((n) => n.id !== notificationId)
    );
  }

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
