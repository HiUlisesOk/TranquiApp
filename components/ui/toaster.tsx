"use client";

import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map((toast) => (
        <Toast key={toast.id} open>
          <ToastTitle>{toast.title}</ToastTitle>
          {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
