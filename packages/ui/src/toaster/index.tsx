"use client";

import { Toast } from "@base-ui/react/toast";

export type ToastType = "default" | "success" | "error";

export const toastManager = Toast.createToastManager();

const typeStyles: Record<ToastType, string> = {
  default: "border-border bg-surface text-foreground",
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
};

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <ToasterViewport />
    </Toast.Provider>
  );
}

function ToasterViewport() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Viewport className="fixed top-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className={`animate-toast-bounce rounded-lg border p-4 shadow-lg transition-all duration-300 data-ending-style:translate-x-full data-ending-style:opacity-0 ${typeStyles[(toast.type as ToastType) || "default"]}`}
        >
          {toast.title && (
            <Toast.Title className="text-sm font-semibold">{toast.title}</Toast.Title>
          )}
          {toast.description && (
            <Toast.Description className="mt-1 text-sm opacity-80">
              {toast.description}
            </Toast.Description>
          )}
          <Toast.Close className="absolute top-4 right-2 rounded p-1 opacity-50 hover:opacity-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </Toast.Close>
        </Toast.Root>
      ))}
    </Toast.Viewport>
  );
}

export function toast(title: string, options?: { description?: string; type?: ToastType }) {
  return toastManager.add({
    title,
    description: options?.description,
    type: options?.type ?? "default",
  });
}

export { Toast };
