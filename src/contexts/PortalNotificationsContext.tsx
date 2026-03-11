import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { portalGetNotifications, type PortalNotification } from "@/lib/api";

interface PortalNotificationsContextType {
  notifications: PortalNotification[];
  loading: boolean;
  refetch: () => Promise<void>;
}

const PortalNotificationsContext = createContext<PortalNotificationsContextType | null>(null);

export function PortalNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    const data = await portalGetNotifications();
    setNotifications(data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    portalGetNotifications()
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

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [refetch]);

  return (
    <PortalNotificationsContext.Provider value={{ notifications, loading, refetch }}>
      {children}
    </PortalNotificationsContext.Provider>
  );
}

export function usePortalNotifications() {
  const ctx = useContext(PortalNotificationsContext);
  if (!ctx) throw new Error("usePortalNotifications must be used within PortalNotificationsProvider");
  return ctx;
}
