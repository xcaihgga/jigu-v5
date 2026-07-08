import { useMemo, useState } from "react";
import { CalendarDays, TrendingUp, Check, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { plan as planSvc, progress as progressSvc } from "@/services";
import { dayKey, fmtDate } from "@/lib/storage";
import { cn } from "@/lib/utils";
import LineChart from "@/components/ui/LineChart";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ProgressRing from "@/components/ui/ProgressRing";
import type { Plan } from "@/lib/types";
import type { Point } from "@/components/ui/Sparkline";

const DAY_LABEL = ["日", "一", "二", "三", "四", "五", "六"];
const METRICS = [
  { id: "rpe", name: "RPE 主观费力", color: "#E8654A", yMax: 10, yLabel: "RPE" },
  { id: "pain", name: "疼痛程度", color: "#C84E36", yMax: 10, yLabel: "VAS" },
  { id: "rom", name: "关节活动度", color: "#0F4C4A", yMax: 100, yLabel: "%" },
  { id: "strength", name: "肌力得分", color: "#D4A24C", yMax: 100, yLabel: "%" },
] as const;

export default function ProgressPage() {
  const plans = planSvc.list().filter((p) => p.active);
  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [metric, setMetric] = useState<typeof METRICS[number]["id"]>("rpe");
  const [checkinDay, setCheckinDay] = useState<string | null>(null);

  const currentPlan = plans.find((p) => p.id === planId) ?? plans[0];

  const checkins = useMemo(
    () => currentPlan ? progressSvc.listCheckins(currentPlan.id) : [],
    [currentPlan],
  );

  const cr = currentPlan ? progressSvc.completionRate(currentPlan.id, 28) : { rate: 0, doneDays: 0, plannedDays: 0 };

  const metricData: Point[] = useMemo(() => {
    if (!currentPlan) return [];
    return progressSvc.metrics(currentPlan.patientId, metric, 60);
  }, [currentPlan, metric]);

  // 月历
  const calendar = useMemo(() => {
    const year = month.getFullYear();
    const m = month.getMonth();
    const first = new Date(year, m, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const cells: ({ day: number; key: string; inMonth: true } | { day: 0; inMonth: false })[] = [];
    for (let i = 0; i < startDay; i++) cells.push({ day: 0, inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, key: dayKey(new Date(year, m, d)), inMonth: true });
    return cells;
  }, [month]);

  if (plans.length === 0) {
    return (
      <div className="card">
        <EmptyState icon={<Activity className="h-12 w-12" />} title="暂无执行中的计划" desc="生成康复计划后即可在此打卡追踪进度" />
      </div>
    );
  }

  const dayStatus = (key: string) => {
    const ck = checkins.find((c) => c.dayKey === key);
    if (!ck) return null;
    const done = ck.entries.filter((e) => e.done).length;
    const ratio = ck.entries.length ? done / ck.entries.length : 0;
    return { ck, ratio, done };
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Progress Tracking</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">训练进度追踪</h1>
          <p className="text-sm text-ink-mute mt-1">日历打卡、完成率与多指标趋势一目了然。</p>
        </div>
        <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="input w-auto min-w-[200px]">
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.patientName} · {p.title}</option>
          ))}
        </select>
      </header>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        {/* 日历 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title flex items-center gap-2"><CalendarDays className="h-4 w-4 text-teal-500" /> 打卡日历</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid h-7 w-7 place-items-center rounded border border-line hover:bg-cream-100"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm font-medium text-ink w-24 text-center stat-num">{month.getFullYear()} / {String(month.getMonth() + 1).padStart(2, "0")}</span>
              <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid h-7 w-7 place-items-center rounded border border-line hover:bg-cream-100"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {DAY_LABEL.map((d) => <div key={d} className="text-center text-2xs text-ink-mute py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {calendar.map((c, i) => {
              if (!c.inMonth) return <div key={i} />;
              const st = dayStatus(c.key);
              const today = c.key === dayKey();
              const dow = new Date(c.key).getDay() === 0 ? 7 : new Date(c.key).getDay();
              const scheduled = currentPlan?.schedule.find((s) => s.day === dow)?.entries.length ?? 0;
              return (
                <button
                  key={i}
                  onClick={() => setCheckinDay(c.key)}
                  className={cn(
                    "aspect-square rounded border text-left p-1.5 transition-all relative",
                    today ? "border-coral" : "border-line",
                    st ? (st.ratio >= 0.5 ? "bg-teal-50 border-teal-200" : "bg-amber-soft/30 border-amber-soft") : "bg-surface hover:border-teal-300",
                  )}
                >
                  <span className="text-2xs text-ink-mute stat-num">{c.day}</span>
                  {st && (
                    <div className="absolute bottom-1 left-1 right-1">
                      <div className="h-1 rounded-full bg-cream-200 overflow-hidden">
                        <div className={cn("h-full", st.ratio >= 0.5 ? "bg-teal-500" : "bg-amber")} style={{ width: `${st.ratio * 100}%` }} />
                      </div>
                    </div>
                  )}
                  {!st && scheduled > 0 && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber" />}
                </button>
              );
            })}
          </div>
          {/* 图例 */}
          <div className="flex items-center gap-4 mt-4 text-2xs text-ink-mute">
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-teal-50 border border-teal-200" /> 已完成</span>
            <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-amber-soft/30 border border-amber-soft" /> 部分完成</span>
            <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber" /> 计划训练日</span>
          </div>
        </div>

        {/* 完成率 + 趋势小卡 */}
        <div className="space-y-5">
          <div className="card p-5 flex items-center gap-5">
            <ProgressRing value={cr.rate} size={88} stroke={7} />
            <div>
              <p className="label-text mb-0">28 天完成率</p>
              <p className="font-display text-2xl text-ink mt-1">{cr.doneDays}<span className="text-base text-ink-mute"> / {cr.plannedDays} 天</span></p>
              <p className="text-2xs text-ink-mute mt-1">共打卡 {checkins.length} 次</p>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-teal-500" />
              <h2 className="section-title">最近评估趋势</h2>
            </div>
            {(() => {
              const data = progressSvc.metrics(currentPlan!.patientId, "strength", 10);
              return data.length > 0 ? (
                <>
                  <p className="stat-num text-2xl text-ink">{data[data.length - 1].value}<span className="text-sm text-ink-mute">%</span></p>
                  <p className="text-2xs text-ink-mute mt-1">最近一次功能得分</p>
                </>
              ) : (
                <p className="text-2xs text-ink-faint">暂无评估数据</p>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="section-title flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-500" /> 多指标趋势</h2>
          <div className="flex flex-wrap gap-1.5">
            {METRICS.map((m) => (
              <button key={m.id} onClick={() => setMetric(m.id)} className={cn("chip", metric === m.id && "chip-active")}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
        {metricData.length > 0 ? (
          <LineChart
            series={[{ name: METRICS.find((m) => m.id === metric)!.name, color: METRICS.find((m) => m.id === metric)!.color, data: metricData }]}
            yMax={METRICS.find((m) => m.id === metric)!.yMax}
            yLabel={METRICS.find((m) => m.id === metric)!.yLabel}
            width={760}
            height={280}
          />
        ) : (
          <EmptyState icon={<TrendingUp className="h-10 w-10" />} title="暂无趋势数据" desc="完成打卡或多次评估后将生成趋势曲线" />
        )}
      </div>

      {/* 打卡弹窗 */}
      <CheckinModal
        dayKey={checkinDay}
        plan={currentPlan}
        onClose={() => setCheckinDay(null)}
      />
    </div>
  );
}

function CheckinModal({ dayKey: dk, plan, onClose }: { dayKey: string | null; plan?: Plan; onClose: () => void }) {
  const exercises = planSvc.listExercises();
  const sched = plan?.schedule.find((s) => s.day === (new Date(dk ?? Date.now()).getDay() === 0 ? 7 : new Date(dk ?? Date.now()).getDay()));
  const entries = sched?.entries ?? [];
  const existing = dk && plan ? progressSvc.listCheckins(plan.id).find((c) => c.dayKey === dk) : undefined;

  const [done, setDone] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    (existing?.entries ?? entries.map((e) => ({ exerciseId: e.exerciseId, done: false, rpe: 0 }))).forEach((e) => (m[e.exerciseId] = e.done));
    return m;
  });
  const [rpe, setRpe] = useState(existing?.rpe ?? 5);
  const [note, setNote] = useState(existing?.note ?? "");

  if (!dk || !plan) return null;

  const submit = () => {
    progressSvc.checkin({
      planId: plan.id,
      patientId: plan.patientId,
      dayKey: dk,
      rpe,
      note,
      entries: entries.map((e) => ({ exerciseId: e.exerciseId, done: !!done[e.exerciseId], rpe })),
    });
    onClose();
  };

  return (
    <Modal
      open={!!dk}
      onClose={onClose}
      title={`${fmtDate(new Date(dk).getTime())} 打卡`}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost btn-sm">取消</button>
          <button onClick={submit} className="btn-primary btn-sm"><Check className="h-3.5 w-3.5" /> 保存打卡</button>
        </>
      }
    >
      {entries.length === 0 ? (
        <p className="text-sm text-ink-mute py-4 text-center">该日未安排训练动作</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {entries.map((e) => {
              const ex = exercises.find((x) => x.id === e.exerciseId);
              if (!ex) return null;
              return (
                <label key={e.exerciseId} className="flex items-center gap-3 rounded border border-line p-2.5 cursor-pointer hover:bg-cream-50">
                  <button
                    type="button"
                    onClick={() => setDone((d) => ({ ...d, [e.exerciseId]: !d[e.exerciseId] }))}
                    className={cn("grid h-5 w-5 place-items-center rounded border shrink-0", done[e.exerciseId] ? "bg-teal-500 border-teal-500 text-cream-50" : "border-line")}
                  >
                    {done[e.exerciseId] && <Check className="h-3 w-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">{ex.title}</p>
                    <p className="text-2xs text-ink-mute">{e.sets}×{e.reps} {e.load ? `· ${e.load}` : ""}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <div>
            <label className="label-text">综合 RPE 主观费力（0 极轻松 → 10 极限）</label>
            <div className="flex items-center gap-3">
              <input type="range" min={0} max={10} value={rpe} onChange={(e) => setRpe(+e.target.value)} className="flex-1 accent-teal-500" />
              <span className="stat-num text-lg text-ink w-8 text-center">{rpe}</span>
            </div>
          </div>
          <div>
            <label className="label-text">备注</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="input resize-none" placeholder="今日感受、不适或进展…" />
          </div>
        </div>
      )}
    </Modal>
  );
}
