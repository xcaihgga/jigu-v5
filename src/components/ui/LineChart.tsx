import { useMemo, useState } from "react";
import type { Point } from "./Sparkline";

export default function LineChart({
  series,
  width = 760,
  height = 260,
  yLabel,
  yMax,
  yMin = 0,
}: {
  series: { name: string; color: string; data: Point[] }[];
  width?: number;
  height?: number;
  yLabel?: string;
  yMax?: number;
  yMin?: number;
}) {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const padL = 38;
  const padR = 16;
  const padT = 16;
  const padB = 28;

  const { allValues, allDates, lines, xStep, plotH } = useMemo(() => {
    const allDates = Array.from(new Set(series.flatMap((s) => s.data.map((d) => d.date)))).sort();
    const allValues = series.flatMap((s) => s.data.map((d) => d.value));
    const maxV = yMax ?? Math.max(yMin, ...allValues) * 1.1;
    const minV = yMin;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const xStep = allDates.length > 1 ? plotW / (allDates.length - 1) : plotW;
    const lines = series.map((s) => {
      const pts = allDates.map((date, i) => {
        const p = s.data.find((d) => d.date === date);
        const x = padL + i * xStep;
        const y = padT + plotH * (1 - ((p ? p.value : 0) - minV) / (maxV - minV || 1));
        return { x, y, v: p ? p.value : null } as const;
      });
      const path = pts
        .filter((p) => p.v !== null)
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
        .join(" ");
      return { name: s.name, color: s.color, pts, path };
    });
    return { allValues, allDates, lines, xStep, plotW, plotH, maxV, minV };
  }, [series, width, height, yMax, yMin]);

  const maxV = yMax ?? Math.max(yMin, ...allValues) * 1.1;
  const ticks = 4;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => yMin + ((maxV - yMin) / ticks) * i);

  return (
    <div className="relative">
      <svg
        width={width}
        height={height}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (allDates.length < 2) return;
          const i = Math.round((x - padL) / xStep);
          if (i < 0 || i >= allDates.length) return;
          setHover({ i, x: padL + i * xStep, y: e.clientY - rect.top });
        }}
      >
        {/* y grid + labels */}
        {tickVals.map((v, i) => {
          const y = padT + plotH * (1 - (v - yMin) / (maxV - yMin || 1));
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#E4DFD0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "3 4"} />
              <text x={padL - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-ink-faint" style={{ fontSize: "10px", fontFamily: "IBM Plex Mono" }}>
                {Math.round(v * 10) / 10}
              </text>
            </g>
          );
        })}
        {/* x labels */}
        {allDates.map((d, i) => {
          if (allDates.length > 8 && i % Math.ceil(allDates.length / 6) !== 0 && i !== allDates.length - 1) return null;
          const x = padL + i * xStep;
          return (
            <text key={d} x={x} y={height - 8} textAnchor="middle" className="fill-ink-faint" style={{ fontSize: "10px", fontFamily: "IBM Plex Mono" }}>
              {d.slice(5)}
            </text>
          );
        })}
        {/* y label */}
        {yLabel && (
          <text x={12} y={padT + 4} className="fill-ink-mute" style={{ fontSize: "10px", fontFamily: "IBM Plex Sans" }}>
            {yLabel}
          </text>
        )}
        {/* lines */}
        {lines.map((l) => (
          <g key={l.name}>
            <path d={l.path} fill="none" stroke={l.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {l.pts.map((p, i) =>
              p.v !== null ? <circle key={i} cx={p.x} cy={p.y} r="2.6" fill={l.color} /> : null,
            )}
          </g>
        ))}
        {/* hover */}
        {hover && (
          <line x1={hover.x} y1={padT} x2={hover.x} y2={height - padB} stroke="#0F4C4A" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        )}
      </svg>
      {hover && (
        <div
          className="absolute pointer-events-none card px-2.5 py-2 text-2xs shadow-lift"
          style={{ left: Math.min(hover.x + 8, width - 130), top: 8 }}
        >
          <div className="font-medium text-ink mb-1">{allDates[hover.i]}</div>
          {series.map((s) => {
            const p = s.data.find((d) => d.date === allDates[hover.i]);
            return (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-ink-mute">{s.name}</span>
                <span className="ml-auto font-mono text-ink">{p ? p.value : "—"}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* legend */}
      <div className="flex flex-wrap gap-3 mt-1">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-2xs text-ink-mute">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
