"use client";

import * as React from "react";

type ToastItem = { id: string; title: string; description?: string };
const ToastContext = React.createContext<{ toasts: ToastItem[]; push: (toast: Omit<ToastItem, "id">) => void }>({
  toasts: [],
  push: () => undefined
});

export function ToastStoreProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return <ToastContext.Provider value={{ toasts, push }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  return React.useContext(ToastContext);
}
