import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useUIStore } from "@/store/ui";

export default function Toaster() {
  const { toasts, dismiss } = useUIStore();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[min(92vw,360px)]">
      {toasts.map((t) => {
        const Icon = t.type === "success" ? CheckCircle2 : t.type === "error" ? AlertCircle : Info;
        const color =
          t.type === "success" ? "text-teal-500" : t.type === "error" ? "text-coral" : "text-amber-dark";
        return (
          <div
            key={t.id}
            className="card flex items-start gap-2.5 px-3.5 py-3 animate-fade-up shadow-lift"
          >
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${color}`} />
            <span className="text-sm text-ink-soft flex-1 leading-snug">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-ink-faint hover:text-ink-mute">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
