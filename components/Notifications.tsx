import { useEffect } from "react";

import {
  NOTIFICATION_DURATION_MS,
  Notification,
  useNotifications,
} from "@/providers/NotificationsProvider";

export function Notifications() {
  const { notifications } = useNotifications();

  return (
    <div
      className="flex flex-col items-center justify-center z-50"
      style={{
        position: "absolute",
        top: "60px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id + notification.message + Math.random()}
          notification={notification}
        />
      ))}
    </div>
  );
}

function Notification({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  useEffect(() => {
    setTimeout(
      () => removeNotification(notification.id),
      NOTIFICATION_DURATION_MS
    );
  }, []);

  return (
    <div
      className="mb-1.5 bg-white text-black p-2 rounded-md font-bold"
      onClick={() => removeNotification(notification.id)}
    >
      {notification.message}
    </div>
  );
}
