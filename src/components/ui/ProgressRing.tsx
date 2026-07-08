import { cn } from "@/lib/utils";

export default function ProgressRing({
  value,
  size = 56,
  stroke = 5,
  color = "#0F4C4A",
  label,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4DFD0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className={cn("absolute flex flex-col items-center")}>
        <span className="stat-num text-sm text-ink leading-none">{Math.round(value)}<span className="text-2xs">%</span></span>
        {label && <span className="text-2xs text-ink-faint mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
