import { useMemo } from "react";

export interface Point {
  date: string;
  value: number;
}

// 迷你趋势线，无坐标轴
export default function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke = "#0F4C4A",
  fill = true,
}: {
  data: Point[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: boolean;
}) {
  const { path, area, lastX, lastY, hasData } = useMemo(() => {
    if (!data.length) return { path: "", area: "", lastX: 0, lastY: 0, hasData: false };
    const vals = data.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const pad = 3;
    const stepX = (width - pad * 2) / Math.max(1, data.length - 1);
    const pts = data.map((d, i) => {
      const x = pad + i * stepX;
      const y = pad + (height - pad * 2) * (1 - (d.value - min) / range);
      return [x, y] as const;
    });
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
    const area = `${path} L${pts[pts.length - 1][0].toFixed(1)},${height} L${pts[0][0].toFixed(1)},${height} Z`;
    return { path, area, lastX: pts[pts.length - 1][0], lastY: pts[pts.length - 1][1], hasData: true };
  }, [data, width, height]);

  if (!hasData) {
    return (
      <svg width={width} height={height} className="opacity-40">
        <line x1="3" y1={height / 2} x2={width - 3} y2={height / 2} stroke="#9A9A9A" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    );
  }
  const gid = `sg_${Math.random().toString(36).slice(2, 8)}`;
  return (
    <svg width={width} height={height}>
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.18" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.2" fill={stroke} />
    </svg>
  );
}
