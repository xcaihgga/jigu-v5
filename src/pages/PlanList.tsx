import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CalendarRange, Plus, ArrowRight, CalendarClock, User,
  CalendarDays, TrendingUp, Check, ChevronLeft, ChevronRight, Activity,
  Flag, Route, Users, ChevronRight as ChevronRightIcon,
  Filter, Grid3X3, LayoutList
} from "lucide-react";
import { assess, plan as planSvc, progress as progressSvc, pathway, patient as patientSvc } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { dayKey, fmtDate } from "@/lib/storage";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import ProgressRing from "@/components/ui/ProgressRing";
import LineChart from "@/components/ui/LineChart";
import CategoryIcon, { CATEGORY_META } from "@/components/CategoryIcon";
import type { Plan } from "@/lib/types";
import type { Category } from "@/lib/types";
import type { Point } from "@/components/ui/Sparkline";

const DAY_LABEL_PLAN = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const DAY_LABEL_CAL = ["日", "一", "二", "三", "四", "五", "六"];
const METRICS = [
  { id: "rpe", name: "RPE 主观费力", color: "#E8654A", yMax: 10, yLabel: "RPE" },
  { id: "pain", name: "疼痛程度", color: "#C84E36", yMax: 10, yLabel: "VAS" },
  { id: "rom", name: "关节活动度", color: "#0F4C4A", yMax: 100, yLabel: "%" },
  { id: "strength", name: "肌力得分", color: "#D4A24C", yMax: 100, yLabel: "%" },
] as const;

export default function PlanList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuthStore();

  const plans = useMemo(() => planSvc.list(), []);
  const activePlans = useMemo(() => plans.filter((p) => p.active), [plans]);
  const patients = useMemo(() => patientSvc.list(), []);
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const currentPatient = patients.find((p) => p.id === patientId);

  const suggestions = useMemo(() => (patientId ? pathway.recommend(patientId) : []), [patientId]);
  const allPathways = useMemo(() => pathway.list(), []);
  const [pwCategory, setPwCategory] = useState<string>("all");
  const pathwayCategories = useMemo(() => {
    const cats = new Set(allPathways.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [allPathways]);
  const filteredPathways = useMemo(() => {
    if (pwCategory === "all") return allPathways;
    return allPathways.filter((p) => p.category === pwCategory);
  }, [allPathways, pwCategory]);
  const states = useMemo(() => (patientId ? pathway.statesByPatient(patientId) : []), [patientId]);
  const pathwayRecords = useMemo(() => (patientId ? assess.listRecords(patientId) : []), [patientId]);

  const [activePlanId, setActivePlanId] = useState(activePlans[0]?.id ?? "");
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [metric, setMetric] = useState<typeof METRICS[number]["id"]>("rpe");

  const currentPlan = activePlans.find((p) => p.id === activePlanId) ?? activePlans[0];

  const checkins = useMemo(
    () => currentPlan ? progressSvc.listCheckins(currentPlan.id) : [],
    [currentPlan],
  );

  const cr = currentPlan ? progressSvc.completionRate(currentPlan.id, 28) : { rate: 0, doneDays: 0, plannedDays: 0 };

  const metricData: Point[] = useMemo(() => {
    if (!currentPlan) return [];
    return progressSvc.metrics(currentPlan.patientId, metric, 60);
  }, [currentPlan, metric]);

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

  useEffect(() => {
    const from = params.get("from");
    if (from && user) {
      const existing = planSvc.list().find((p) => p.recordId === from);
      if (existing) {
        navigate(`/plan/${existing.id}`, { replace: true });
        return;
      }
      const rec = assess.getRecord(from);
      if (rec) {
        const newPlan = planSvc.generateFrom(from, user.id);
        if (newPlan) {
          toast.success("已基于评估生成计划草稿");
          navigate(`/plan/${newPlan.id}`, { replace: true });
          return;
        }
      }
    }
  }, [params, user, navigate]);

  const prevMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = () => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Rehab Plan & Tracking</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">康复计划与进度追踪</h1>
          <p className="text-sm text-ink-mute mt-1">基于评估生成可编辑的训练计划，按周日程排期，并追踪每日打卡进度。</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-ink-mute" />
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input w-auto min-w-[200px]">
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.diagnosis}</option>)}
          </select>
          <button onClick={() => navigate("/assess")} className="btn-primary">
            <Plus className="h-4 w-4" /> 从评估生成计划
          </button>
        </div>
      </header>

      {/* 患者信息条 */}
      {currentPatient && (
        <div className="card p-4 flex items-center gap-4 flex-wrap">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-teal-500 text-cream-50 font-medium">{currentPatient.name.slice(0, 1)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">{currentPatient.name} <span className="text-2xs text-ink-mute font-normal">{currentPatient.age}岁 · {currentPatient.sex}</span></p>
            <p className="text-2xs text-ink-mute">{currentPatient.diagnosis}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {currentPatient.tags.map((t) => <span key={t} className="chip text-2xs">{t}</span>)}
          </div>
        </div>
      )}

      {/* 临床路径 */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-teal-500" />
            <h2 className="section-title">临床路径</h2>
            <span className="text-2xs text-ink-mute">共 {allPathways.length} 条路径 · 可自主选择启用</span>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-ink-mute" />
            <select value={pwCategory} onChange={(e) => setPwCategory(e.target.value)} className="input w-auto text-sm py-1.5">
              {pathwayCategories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "全部分类" : CATEGORY_META[c as Category]?.name || c}
                </option>
              ))}
            </select>
          </div>
        </div>
        {filteredPathways.length === 0 ? (
          <div className="card"><EmptyState title="暂无路径" desc="该分类下暂无临床路径" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 stagger">
            {filteredPathways.map((pw) => {
              const st = pathway.state(patientId, pw.id);
              const sug = suggestions.find((s) => s.pathway.id === pw.id);
              return (
                <div key={pw.id} className="card p-4 flex flex-col hover:shadow-lift transition-all">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={pw.category} />
                      <span className="chip text-2xs">{pw.stages.length} 阶段</span>
                      {pw.track && (
                        <span className={cn("text-2xs px-2 py-0.5 rounded", pw.track === "conservative" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600")}>
                          {pw.track === "conservative" ? "保守" : "术后"}
                        </span>
                      )}
                    </div>
                    {sug && (
                      <div className="text-right">
                        <p className="stat-num text-sm text-coral">{sug.fit}<span className="text-2xs text-ink-faint">%</span></p>
                        <p className="text-2xs text-ink-mute">匹配</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-base text-ink leading-tight">{pw.title}</h3>
                  <p className="text-2xs text-ink-mute mt-1 leading-relaxed line-clamp-2">{pw.summary}</p>
                  {pw.techFeatures && pw.techFeatures.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {pw.techFeatures.slice(0, 3).map((tf, i) => (
                        <span key={i} className="rounded bg-teal-50 px-2 py-0.5 text-2xs text-teal-600">{tf}</span>
                      ))}
                      {pw.techFeatures.length > 3 && (
                        <span className="rounded bg-teal-50 px-2 py-0.5 text-2xs text-teal-600">+{pw.techFeatures.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-3 flex items-center gap-2">
                    {st ? (
                      <>
                        <span className="chip chip-active text-2xs">已启用 · 第 {st.currentStage + 1} 阶段</span>
                        <button onClick={() => navigate(`/pathway?pw=${pw.id}&p=${patientId}`)} className="btn-ghost btn-sm ml-auto">
                          查看 <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { pathway.start(patientId, pw.id); toast.success(`已启用「${pw.title}」`); }}
                        className="btn-primary btn-sm ml-auto"
                      >
                        <Route className="h-3.5 w-3.5" /> 启用
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 进行中的路径时间轴 */}
      {states.length > 0 && (
        <section className="space-y-4">
          <h2 className="section-title flex items-center gap-2"><Flag className="h-4 w-4 text-teal-500" /> 进行中的路径</h2>
          {states.map((st) => {
            const pw = pathway.get(st.pathwayId);
            if (!pw) return null;
            return (
              <div key={st.id} className="card p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                  <div>
                    <h3 className="font-display text-xl text-ink">{pw.title}</h3>
                    <p className="text-2xs text-ink-mute mt-0.5">启用于 {fmtDate(st.startedAt)} · 已推进 {st.history.length} 次</p>
                    {pw.techFeatures && pw.techFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {pw.techFeatures.map((tf, i) => (
                          <span key={i} className="rounded bg-teal-50 px-2 py-0.5 text-2xs text-teal-600">⚡ {tf}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {st.currentStage < pw.stages.length - 1 && (
                    <button
                      onClick={() => { pathway.advance(patientId, pw.id); toast.success("已推进至下一阶段"); }}
                      className="btn-coral btn-sm"
                    >
                      <Check className="h-3.5 w-3.5" /> 达标，推进下一阶段
                    </button>
                  )}
                </div>

                {/* 时间轴 */}
                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-line" />
                  <div className="space-y-5">
                    {pw.stages.map((stage) => {
                      const done = stage.index < st.currentStage;
                      const active = stage.index === st.currentStage;
                      return (
                        <div key={stage.index} className="relative flex gap-4">
                          <div className={cn(
                            "relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 shrink-0 transition-all",
                            done ? "bg-teal-500 border-teal-500 text-cream-50" : active ? "bg-coral border-coral text-white" : "bg-cream-50 border-line text-ink-faint",
                          )}>
                            {done ? <Check className="h-4 w-4" /> : <span className="stat-num text-xs">{stage.index + 1}</span>}
                          </div>
                          <div className={cn("flex-1 rounded border p-4 transition-all", active ? "border-coral bg-coral-soft/10 shadow-soft" : done ? "border-line bg-cream-50/40" : "border-line bg-surface opacity-70")}>
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                              <h4 className={cn("font-medium", active ? "text-coral-dark" : "text-ink")}>{stage.title}</h4>
                              <span className="chip text-2xs">{stage.window}</span>
                            </div>
                            <p className="text-2xs text-ink-mute mb-3">目标：{stage.goal}</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {stage.keyActions.map((a) => (
                                <span key={a} className="rounded bg-cream-100 px-2 py-0.5 text-2xs text-ink-soft">{a}</span>
                              ))}
                            </div>
                            {stage.techFeatures && stage.techFeatures.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {stage.techFeatures.map((tf, i) => (
                                  <span key={i} className="rounded bg-teal-50 px-2 py-0.5 text-2xs text-teal-600">⚡ {tf}</span>
                                ))}
                              </div>
                            )}
                            <div className={cn("rounded px-3 py-2 text-2xs flex items-start gap-1.5", active ? "bg-teal-50 text-teal-600" : "bg-cream-100 text-ink-mute")}>
                              <Flag className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>达标标志：{stage.milestone}</span>
                            </div>
                            {stage.referral && (
                              <div className="mt-1.5 rounded px-3 py-2 text-2xs bg-coral-soft/20 text-coral-dark flex items-start gap-1.5">
                                <ChevronRightIcon className="h-3 w-3 mt-0.5 shrink-0" />
                                <span>转介提示：{stage.referral}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 最近评估（路径关联） */}
      {pathwayRecords.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3">关联评估记录</h2>
          <div className="divide-y divide-line">
            {pathwayRecords.slice(0, 4).map((r) => (
              <button key={r.id} onClick={() => navigate(`/assess/${r.scaleId}/report/${r.id}`)} className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-cream-50/60 -mx-2 px-2 rounded">
                <CategoryIcon category={r.category} className="h-3.5 w-3.5" />
                <span className="text-sm text-ink flex-1 truncate">{r.scaleTitle}</span>
                <span className="stat-num text-2xs text-ink-mute">{fmtDate(r.takenAt)}</span>
                <span className="text-2xs text-ink-mute">{r.grade}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {plans.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CalendarRange className="h-12 w-12" />}
            title="还没有康复计划"
            desc="完成一次评估后，可一键生成个性化训练计划草稿。"
            action={<button onClick={() => navigate("/assess")} className="btn-primary btn-sm">去评估中心</button>}
          />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4 stagger">
            {plans.map((p) => {
              const planCr = progressSvc.completionRate(p.id, 14);
              const totalEntries = p.schedule.reduce((acc, d) => acc + d.entries.length, 0);
              return (
                <div key={p.id} className="card p-5 hover:shadow-lift transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {p.active && <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-2xs text-teal-600"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" />执行中</span>}
                        <span className="text-2xs text-ink-mute">{fmtDate(p.createdAt)}</span>
                      </div>
                      <h3 className="font-display text-lg text-ink leading-tight">{p.title}</h3>
                      <p className="text-sm text-ink-mute mt-0.5 inline-flex items-center gap-1"><User className="h-3 w-3" />{p.patientName}</p>
                    </div>
                    <ProgressRing value={planCr.rate} size={52} />
                  </div>

                  <p className="text-xs text-ink-soft mt-3 line-clamp-2">{p.goal}</p>

                  <div className="flex items-center gap-1 mt-4">
                    {p.schedule.slice(1).concat(p.schedule[0]).map((d) => (
                      <div key={d.day} className="flex-1 text-center">
                        <div className={`h-7 rounded text-2xs flex items-center justify-center ${d.entries.length > 0 ? "bg-teal-50 text-teal-600 font-medium" : "bg-cream-100 text-ink-faint"}`}>
                          {DAY_LABEL_PLAN[d.day].slice(1)}
                        </div>
                        <span className="text-2xs text-ink-faint mt-1 inline-block">{d.entries.length || "—"}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
                    <span className="text-2xs text-ink-mute inline-flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" /> {totalEntries} 项动作 · {p.durationWeeks} 周
                    </span>
                    <button onClick={() => navigate(`/plan/${p.id}`)} className="text-sm text-teal-500 font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                      编辑计划 <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-5 mt-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-500" />
              <h2 className="section-title">训练进度追踪</h2>
              <span className="text-2xs text-ink-mute">日历打卡、完成率与多指标趋势</span>
            </div>

            {activePlans.length > 0 ? (
              <>
                <div className="card">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-teal-500" />
                      <span className="text-sm font-medium text-ink">打卡日历</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={prevMonth} className="p-1 hover:bg-cream-200 rounded"><ChevronLeft className="h-4 w-4" /></button>
                      <span className="text-sm font-medium text-ink">{month.getFullYear()}年{month.getMonth() + 1}月</span>
                      <button onClick={nextMonth} className="p-1 hover:bg-cream-200 rounded"><ChevronRight className="h-4 w-4" /></button>
                      <select value={activePlanId} onChange={(e) => setActivePlanId(e.target.value)} className="input w-auto text-sm">
                        {activePlans.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {DAY_LABEL_CAL.map((d) => <div key={d} className="text-center text-2xs text-ink-mute py-2">{d}</div>)}
                    {calendar.map((c, i) => {
                      const dateKey = dayKey(new Date(month.getFullYear(), month.getMonth(), c.day));
                      const checked = c.inMonth && checkins.some((ch) => ch.dayKey === dateKey);
                      const hasPlan = c.inMonth && currentPlan?.schedule.some((s) => s.day === c.day);
                      return (
                        <div key={i} className={cn(
                          "aspect-square rounded flex items-center justify-center text-sm transition-colors",
                          !c.inMonth && "bg-transparent",
                          c.inMonth && !checked && !hasPlan && "bg-cream-50 text-ink-faint",
                          c.inMonth && !checked && hasPlan && "bg-teal-50 text-teal-600",
                          c.inMonth && checked && "bg-teal-500 text-white font-medium",
                        )}>
                          {c.inMonth && c.day}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-teal-500" />
                      <span className="text-sm font-medium text-ink">完成率</span>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-display text-teal-500">{cr.rate}%</div>
                      <div className="text-sm text-ink-mute mb-1">
                        <div>{cr.doneDays} / {cr.plannedDays} 天</div>
                        <div className="text-2xs mt-1">近 28 天</div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="h-4 w-4 text-coral" />
                      <span className="text-sm font-medium text-ink">本周打卡</span>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-display text-coral">
                        {checkins.filter((c) => {
                          const d = new Date(c.dayKey);
                          const now = new Date();
                          const day = now.getDay() || 7;
                          const monday = new Date(now);
                          monday.setDate(now.getDate() - day + 1);
                          return d >= monday;
                        }).length}
                      </div>
                      <div className="text-sm text-ink-mute mb-1">
                        <div>次打卡</div>
                        <div className="text-2xs mt-1">本周</div>
                      </div>
                    </div>
                  </div>

                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarClock className="h-4 w-4 text-amber-dark" />
                      <span className="text-sm font-medium text-ink">活跃计划</span>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="text-4xl font-display text-amber-dark">{activePlans.length}</div>
                      <div className="text-sm text-ink-mute mb-1">
                        <div>个进行中</div>
                        <div className="text-2xs mt-1">共 {plans.length} 个计划</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-teal-500" />
                      <span className="text-sm font-medium text-ink">指标趋势</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {METRICS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMetric(m.id)}
                          className={cn(
                            "px-3 py-1 rounded-full text-2xs font-medium transition-colors",
                            metric === m.id ? "bg-teal-500 text-white" : "bg-cream-100 text-ink-soft hover:bg-cream-200",
                          )}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <LineChart series={[{ name: METRICS.find((m) => m.id === metric)?.name || "", color: METRICS.find((m) => m.id === metric)?.color || "#0F4C4A", data: metricData }]} yMax={METRICS.find((m) => m.id === metric)?.yMax || 100} yLabel={METRICS.find((m) => m.id === metric)?.yLabel || ""} />
                </div>
              </>
            ) : (
              <div className="card p-5 text-center">
                <TrendingUp className="h-8 w-8 text-ink-faint mx-auto mb-3" />
                <p className="text-sm text-ink-mute">暂无活跃计划，完成评估后可开启进度追踪</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
