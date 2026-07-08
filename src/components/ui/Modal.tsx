import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const w = size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-teal-900/30 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={cn("relative card w-full animate-scale-in shadow-lift", w)} style={{ maxHeight: "88vh" }}>
        {title && (
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h3 className="font-display text-lg text-ink">{title}</h3>
            <button onClick={onClose} className="text-ink-faint hover:text-ink-mute">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(88vh - 120px)" }}>
          {children}
        </div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}
