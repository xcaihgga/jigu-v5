import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  Camera,
  ScanLine,
  Users,
  FileCheck,
  ArrowRight,
  Plus,
  AlertTriangle,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { scoliosis, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { fmtDate, relativeTime } from "@/lib/storage";
import { getSeverityLabel } from "@/data/scoliosis";

export default function ScoliosisMainPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const tid = user?.id ?? "";

  const data = useMemo(() => {
    const patients = patient.list(tid);
    const records = scoliosis.listRecords();
    const photos = scoliosis.listPhotos();
    const cobbMeasurements = scoliosis.listCobbMeasurements();
    const consensuses = scoliosis.listConsensuses();

    const recentRecords = records.slice(0, 5);
    const highRisk = records.filter((r) => r.severity === "重度" || r.severity === "极重度");

    return {
      patients,
      records,
      photos,
      cobbMeasurements,
      consensuses,
      recentRecords,
      highRisk,
    };
  }, [tid]);

  const stats = [
    {
      label: "评估记录",
      value: data.records.length,
      icon: FileCheck,
      color: "text-teal-500",
      bg: "bg-teal-50",
      to: "/scoliosis",
    },
    {
      label: "拍照评估",
      value: data.photos.length,
      icon: Camera,
      color: "text-coral",
      bg: "bg-coral-soft/30",
      to: "/scoliosis/photo",
    },
    {
      label: "Cobb测量",
      value: data.cobbMeasurements.length,
      icon: ScanLine,
      color: "text-amber-dark",
      bg: "bg-amber-soft/30",
      to: "/scoliosis/cobb",
    },
    {
      label: "专家共识",
      value: data.consensuses.length,
      icon: Users,
      color: "text-ink",
      bg: "bg-cream-200",
      to: "/scoliosis/consensus",
    },
  ];

  return (
    <div className="space-y-6 stagger">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-text">Scoliosis Assessment</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">脊柱侧弯评估中心</h1>
          <p className="text-sm text-ink-mute mt-1">
            从拍照筛查、X线测量到专家共识和康复计划的一站式管理平台
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/scoliosis/photo")} className="btn-primary">
            <Camera className="h-4 w-4" /> 拍照评估
          </button>
          <button onClick={() => navigate("/scoliosis/cobb")} className="btn-ghost">
            <ScanLine className="h-4 w-4" /> Cobb测量
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {data.highRisk.length > 0 && (
        <section className="card p-5 border-coral-soft/40 bg-coral-soft/10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-coral" />
            <h2 className="section-title">高危预警</h2>
            <span className="text-2xs text-ink-mute">
              {data.highRisk.length} 位患者需关注
            </span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.highRisk.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="rounded border border-line bg-surface p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-ink text-sm">{r.patientName}</span>
                  <span className="text-2xs text-coral font-medium">{r.severity}</span>
                </div>
                <div className="flex items-center gap-3 text-2xs text-ink-mute">
                  <span>Cobb角: {r.primaryCurveAngle}°</span>
                  <span>{r.curveType}</span>
                </div>
                <button
                  onClick={() => navigate(`/scoliosis/record/${r.id}`)}
                  className="mt-3 text-2xs text-teal-500 hover:underline inline-flex items-center gap-1"
                >
                  查看详情 <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">近期评估记录</h2>
            <button
              onClick={() => navigate("/scoliosis/list")}
              className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1"
            >
              查看全部 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {data.records.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-faint">
              <FileCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
              暂无评估记录，开始首次评估
            </div>
          ) : (
            <div className="divide-y divide-line">
              {data.recentRecords.map((r) => {
                const p = data.patients.find((x) => x.id === r.patientId);
                return (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/scoliosis/record/${r.id}`)}
                    className="w-full flex items-center gap-3 py-3 text-left hover:bg-cream-50/60 -mx-2 px-2 rounded transition-colors"
                  >
                    <div
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded",
                        r.severity === "轻度"
                          ? "bg-teal-50 text-teal-600"
                          : r.severity === "中度"
                          ? "bg-amber-soft/40 text-amber-dark"
                          : "bg-coral-soft/30 text-coral",
                      )}
                    >
                      <span className="stat-num text-sm">{r.primaryCurveAngle}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">
                        {r.patientName} · {getSeverityLabel(r.primaryCurveAngle)}
                      </p>
                      <p className="text-2xs text-ink-mute">
                        {r.curveType} · {r.primaryCurveLocation} ·{" "}
                        {relativeTime(r.createdAt)}
                      </p>
                    </div>
                    <span className="text-right shrink-0">
                      <p className="stat-num text-sm text-ink">
                        {r.primaryCurveAngle}°
                      </p>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">快速开始</h2>
            <Plus className="h-4 w-4 text-teal-500" />
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/scoliosis/photo")}
              className="w-full flex items-center gap-3 p-3 rounded border border-line hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left"
            >
              <div className="grid h-10 w-10 place-items-center rounded bg-coral-soft/30">
                <Camera className="h-5 w-5 text-coral" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">拍照筛查评估</p>
                <p className="text-2xs text-ink-mute">通过前后位照片评估肩部、腰部对称性</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint ml-auto" />
            </button>
            <button
              onClick={() => navigate("/scoliosis/cobb")}
              className="w-full flex items-center gap-3 p-3 rounded border border-line hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left"
            >
              <div className="grid h-10 w-10 place-items-center rounded bg-amber-soft/40">
                <ScanLine className="h-5 w-5 text-amber-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Cobb角度测量</p>
                <p className="text-2xs text-ink-mute">基于X线影像测量脊柱侧弯角度</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint ml-auto" />
            </button>
            <button
              onClick={() => navigate("/scoliosis/consensus")}
              className="w-full flex items-center gap-3 p-3 rounded border border-line hover:border-teal-400 hover:bg-teal-50/50 transition-all text-left"
            >
              <div className="grid h-10 w-10 place-items-center rounded bg-cream-200">
                <Users className="h-5 w-5 text-ink" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">专家共识</p>
                <p className="text-2xs text-ink-mute">基于指南的治疗建议与随访计划</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint ml-auto" />
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-line">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-teal-500" />
              <span className="text-sm font-medium text-ink">评估趋势</span>
            </div>
            <div className="space-y-2">
              {["轻度", "中度", "重度", "极重度"].map((level, idx) => {
                const count = data.records.filter((r) => r.severity === level).length;
                const max = Math.max(...["轻度", "中度", "重度", "极重度"].map((l) =>
                  data.records.filter((r) => r.severity === l).length,
                ));
                return (
                  <div key={level} className="flex items-center gap-2">
                    <span className="text-2xs text-ink-mute w-12">{level}</span>
                    <div className="flex-1 h-2 rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          idx === 0
                            ? "bg-teal-500"
                            : idx === 1
                            ? "bg-amber-500"
                            : "bg-coral",
                        )}
                        style={{ width: max ? `${(count / max) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="stat-num text-xs text-ink-mute w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bg,
  to,
}: {
  label: string;
  value: number;
  icon: typeof FileCheck;
  color: string;
  bg: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="card p-4 text-left hover:shadow-lift hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded ${bg}`}>
          <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.7} />
        </div>
      </div>
      <p className="mt-3 stat-num text-2xl text-ink">{value}</p>
      <p className="text-2xs text-ink-mute mt-0.5">{label}</p>
    </button>
  );
}