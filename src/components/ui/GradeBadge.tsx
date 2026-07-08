import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad";

const toneCls: Record<Tone, string> = {
  good: "bg-teal-50 text-teal-600 border-teal-200",
  warn: "bg-amber-soft/40 text-amber-dark border-amber-soft",
  bad: "bg-coral-soft/40 text-coral-dark border-coral-soft",
};

export default function GradeBadge({ grade, tone, size = "md" }: { grade: string; tone: Tone; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border font-medium",
        toneCls[tone],
        size === "sm" ? "px-2 py-0.5 text-2xs" : "px-2.5 py-1 text-xs",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {grade}
    </span>
  );
}
