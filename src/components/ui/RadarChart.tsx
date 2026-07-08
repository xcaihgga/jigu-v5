import { useMemo } from "react";

export interface RadarDatum {
  dimension: string;
  score: number;
  max: number;
}

export default function RadarChart({ data, size = 240 }: { data: RadarDatum[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const n = data.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const { polygon, rings, axes, labels } = useMemo(() => {
    const rings = [0.25, 0.5, 0.75, 1].map((ratio) =>
      Array.from({ length: n }, (_, i) => {
        const a = angle(i);
        return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio] as const;
      }),
    );
    const axes = Array.from({ length: n }, (_, i) => {
      const a = angle(i);
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
    });
    const polygon = data
      .map((d, i) => {
        const ratio = d.max ? d.score / d.max : 0;
        const a = angle(i);
        return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio] as const;
      })
      .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
      .join(" ");
    const labels = data.map((d, i) => {
      const a = angle(i);
      const lr = r + 16;
      return { x: cx + Math.cos(a) * lr, y: cy + Math.sin(a) * lr, label: d.dimension } as const;
    });
    return { polygon, rings, axes, labels };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, n, size]);

  if (n < 3) {
    return (
      <div className="flex h-[240px] items-center justify-center text-2xs text-ink-faint">
        维度不足，无法绘制雷达图
      </div>
    );
  }

  return (
    <svg width={size} height={size} className="overflow-visible">
      {rings.map((ring, i) => (
        <polygon
          key={i}
          points={ring.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")}
          fill="none"
          stroke="#E4DFD0"
          strokeWidth="1"
        />
      ))}
      {axes.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#E4DFD0" strokeWidth="1" />
      ))}
      <polygon points={polygon.replace(/M|L/g, "").split(" ").join(" ")} fill="rgba(232,101,74,0.16)" stroke="#E8654A" strokeWidth="1.8" />
      <path d={`${polygon} Z`} fill="rgba(232,101,74,0.16)" stroke="#E8654A" strokeWidth="1.8" strokeLinejoin="round" />
      {data.map((d, i) => {
        const a = angle(i);
        const ratio = d.max ? d.score / d.max : 0;
        return <circle key={i} cx={cx + Math.cos(a) * r * ratio} cy={cy + Math.sin(a) * r * ratio} r="2.6" fill="#E8654A" />;
      })}
      {labels.map((l, i) => (
        <text
          key={i}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-ink-mute"
          style={{ fontSize: "11px", fontFamily: "IBM Plex Sans" }}
        >
          {l.label}
        </text>
      ))}
    </svg>
  );
}
