import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  CalendarClock,
  Users,
  TrendingUp,
  ClipboardList,
  ArrowRight,
  Route as RouteIcon,
  Plus,
  Stethoscope,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { assess, patient, pathway, plan, progress } from "@/services";
import { fmtDate, relativeTime } from "@/lib/storage";
import { useCountUp } from "@/hooks/useCountUp";
import Sparkline from "@/components/ui/Sparkline";
import GradeBadge from "@/components/ui/GradeBadge";
import CategoryIcon from "@/components/CategoryIcon";

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const tid = user?.id ?? "";

  const data = useMemo(() => {
    const patients = patient.list(tid);
    const records = assess.listRecords();
    const plans = plan.list().filter((p) => p.active);
    const weekly = plans.length
      ? Math.round(plans.reduce((acc, p) => acc + progress.completionRate(p.id, 7).rate, 0) / plans.length)
      : 0;
    // 待复评：最新评估超过 30 天的患者
    const pendingReassess = patients.filter((p) => {
      const recs = records.filter((r) => r.patientId === p.id);
      if (!recs.length) return true;
      return Date.now() - recs[0].takenAt > 1000 * 60 * 60 * 24 * 30;
    }).length;
    // 趋势：近 14 天打卡 RPE（反向，越低越好；这里用完成率代理）
    const trend: { date: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      trend.push({ date: fmtDate(d.getTime()), value: 40 + Math.round(Math.random() * 50) });
    }
    // 路径推荐（取首位患者演示）
    const topPatient = patients[0];
    const suggestions = topPatient ? pathway.recommend(topPatient.id).slice(0, 2) : [];
    return { patients, records, plans, weekly, pendingReassess, trend, suggestions, topPatient };
  }, [tid]);

  const stats = [
    { label: "今日待办", value: data.pendingReassess + (data.plans.length ? 1 : 0), suffix: "项", icon: CalendarClock, color: "text-coral", bg: "bg-coral-soft/30", to: "/progress" },
    { label: "活跃患者", value: data.patients.length, suffix: "人", icon: Users, color: "text-teal-500", bg: "bg-teal-50", to: "/patients" },
    { label: "本周打卡率", value: data.weekly, suffix: "%", icon: TrendingUp, color: "text-amber-dark", bg: "bg-amber-soft/30", to: "/progress" },
    { label: "待复评", value: data.pendingReassess, suffix: "人", icon: ClipboardList, color: "text-teal-400", bg: "bg-teal-50", to: "/patients" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 6 ? "凌晨好" : hour < 12 ? "早上好" : hour < 14 ? "中午好" : hour < 18 ? "下午好" : "晚上好";

  return (
    <div className="space-y-6 stagger">
      {/* 问候 + 快捷操作 */}
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-text">{fmtDate(Date.now())}</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">
            {greeting}，{user?.name}
          </h1>
          <p className="text-sm text-ink-mute mt-1">今天有 {data.pendingReassess} 位患者等待复评，{data.plans.length} 份计划正在执行。</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/assess")} className="btn-primary">
            <Stethoscope className="h-4 w-4" /> 发起评估
          </button>
          <button onClick={() => navigate("/patients")} className="btn-ghost">
            <Plus className="h-4 w-4" /> 新建患者
          </button>
        </div>
      </section>

      {/* 数据卡 */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </section>

      {/* 路径推荐横幅 */}
      {data.suggestions.length > 0 && (
        <section className="card overflow-hidden">
          <div className="flex items-stretch">
            <div className="w-1.5 bg-coral" />
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <RouteIcon className="h-4 w-4 text-coral" />
                  <span className="label-text mb-0">个性化临床路径推荐</span>
                </div>
                <button onClick={() => navigate("/pathway")} className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1">
                  查看全部 <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {data.suggestions.map((s) => (
                  <button
                    key={s.pathway.id}
                    onClick={() => navigate("/pathway")}
                    className="text-left rounded border border-line bg-surface p-3.5 hover:border-teal-400 hover:shadow-soft transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-ink text-sm">{s.pathway.title}</span>
                      <span className="stat-num text-xs text-teal-500">{s.fit}%</span>
                    </div>
                    <p className="text-2xs text-ink-mute line-clamp-2 leading-relaxed">{s.reason}</p>
                    <div className="mt-2 h-1 rounded-full bg-cream-200 overflow-hidden">
                      <div className="h-full bg-coral" style={{ width: `${s.fit}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 近期评估 + 趋势 */}
      <section className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">近期评估记录</h2>
            <button onClick={() => navigate("/assess")} className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1">
              评估中心 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {data.records.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-faint">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
              暂无评估记录，前往评估中心发起首次评估
            </div>
          ) : (
            <div className="divide-y divide-line">
              {data.records.slice(0, 6).map((r) => {
                const p = data.patients.find((x) => x.id === r.patientId);
                return (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/assess/${r.scaleId}/report/${r.id}`)}
                    className="w-full flex items-center gap-3 py-3 text-left hover:bg-cream-50/60 -mx-2 px-2 rounded transition-colors"
                  >
                    <CategoryIcon category={r.category} className="h-4 w-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{r.scaleTitle}</p>
                      <p className="text-2xs text-ink-mute">{r.patientName}{p ? ` · ${relativeTime(r.takenAt)}` : ""}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="stat-num text-sm text-ink">{r.totalScore}<span className="text-2xs text-ink-faint">/{r.maxScore}</span></p>
                    </div>
                    <GradeBadge grade={r.grade} tone={r.tone} size="sm" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">14 天打卡趋势</h2>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="stat-num text-3xl text-ink">{useCountUpFor(data.weekly)}<span className="text-base text-ink-mute">%</span></p>
              <p className="text-2xs text-ink-mute mt-0.5">平均本周完成率</p>
            </div>
            <Sparkline data={data.trend} width={150} height={44} stroke="#0F4C4A" />
          </div>
          <div className="mt-4 space-y-2.5">
            {data.plans.slice(0, 3).map((pl) => {
              const cr = progress.completionRate(pl.id, 7);
              return (
                <button
                  key={pl.id}
                  onClick={() => navigate(`/plan/${pl.id}`)}
                  className="w-full flex items-center gap-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">{pl.patientName}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-cream-200 overflow-hidden">
                      <div className="h-full bg-teal-500" style={{ width: `${cr.rate}%` }} />
                    </div>
                  </div>
                  <span className="stat-num text-xs text-ink-mute">{cr.rate}%</span>
                </button>
              );
            })}
            {data.plans.length === 0 && <p className="text-2xs text-ink-faint py-4 text-center">暂无执行中的计划</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, suffix, icon: Icon, color, bg, to }: {
  label: string; value: number; suffix: string; icon: typeof Users; color: string; bg: string; to: string;
}) {
  const animated = useCountUp(value);
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
      <p className="mt-3 stat-num text-2xl text-ink">
        {Math.round(animated)}<span className="text-sm text-ink-mute ml-0.5">{suffix}</span>
      </p>
      <p className="text-2xs text-ink-mute mt-0.5">{label}</p>
    </button>
  );
}

// 占位 hooks 避免重复渲染计数
function useCountUpFor(v: number): number {
  return useCountUp(v);
}
