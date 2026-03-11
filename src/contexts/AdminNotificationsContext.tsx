import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { adminGetNotifications, type AdminNotificationItem } from "@/lib/api";

interface AdminNotificationsContextType {
  notifications: AdminNotificationItem[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const AdminNotificationsContext = createContext<AdminNotificationsContextType | null>(null);

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const data = await adminGetNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminGetNotifications()
      .then((data) => {
        if (!cancelled) setNotifications(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminNotificationsContext.Provider value={{ notifications, loading, refetch }}>
      {children}
    </AdminNotificationsContext.Provider>
  );
}

export function useAdminNotifications() {
  const ctx = useContext(AdminNotificationsContext);
  if (!ctx) throw new Error("useAdminNotifications must be used within AdminNotificationsProvider");
  return ctx;
}
