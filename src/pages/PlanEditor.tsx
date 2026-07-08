import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, Dumbbell, Search, X, Check, Route, Target, Thermometer } from "lucide-react";
import { plan as planSvc } from "@/services";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type { Exercise, PlanEntry } from "@/lib/types";
import { REHAB_STAGES, RETURN_STANDARDS, ACUTE_COMPARE, ACUTE_COMPARE_NOTE } from "@/data/rehab-pathways";

const DAY_LABEL = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const BODY_PARTS = ["肩", "肘", "腕", "颈", "腰", "膝", "踝", "核心", "平衡", "步态", "心肺", "手"];

export default function PlanEditor() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const original = planId ? planSvc.get(planId) : undefined;

  const [schedule, setSchedule] = useState(original?.schedule ?? []);
  const [activeDay, setActiveDay] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState(false);

  const exercises = planSvc.listExercises();
  const filteredEx = useMemo(() => {
    let list = exercises;
    if (filter) list = list.filter((e) => e.bodyPart === filter);
    if (q.trim()) list = list.filter((e) => e.title.includes(q) || e.goal.includes(q));
    return list;
  }, [exercises, filter, q]);

  if (!original) {
    return <EmptyState title="计划不存在" action={<button onClick={() => navigate("/plan")} className="btn-ghost btn-sm">返回计划列表</button>} />;
  }

  const dayEntries = (day: number) => schedule.find((d) => d.day === day)?.entries ?? [];

  const addExercise = (ex: Exercise) => {
    const entry: PlanEntry = { exerciseId: ex.id, sets: ex.defaultSets, reps: ex.defaultReps };
    setSchedule((s) => s.map((d) => (d.day === activeDay ? { ...d, entries: [...d.entries, entry] } : d)));
    toast.success(`已添加「${ex.title}」到${DAY_LABEL[activeDay]}`);
  };

  const updateEntry = (day: number, idx: number, patch: Partial<PlanEntry>) => {
    setSchedule((s) => s.map((d) => (d.day === day ? { ...d, entries: d.entries.map((e, i) => (i === idx ? { ...e, ...patch } : e)) } : d)));
  };

  const removeEntry = (day: number, idx: number) => {
    setSchedule((s) => s.map((d) => (d.day === day ? { ...d, entries: d.entries.filter((_, i) => i !== idx) } : d)));
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      schedule.forEach((d) => planSvc.setEntry(original.id, d.day, d.entries));
      planSvc.update(original.id, { schedule });
      toast.success("计划已保存");
      setSaving(false);
      navigate("/plan");
    }, 400);
  };

  const totalEntries = schedule.reduce((acc, d) => acc + d.entries.length, 0);

  return (
    <div className="space-y-5">
      {/* 头部 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <button onClick={() => navigate("/plan")} className="inline-flex items-center gap-1 text-2xs text-ink-mute hover:text-teal-500 mb-2">
            <ArrowLeft className="h-3 w-3" /> 计划列表
          </button>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">{original.title}</h1>
          <p className="text-sm text-ink-mute mt-1">{original.patientName} · {original.goal}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">{totalEntries} 项动作</span>
          <button onClick={save} disabled={saving} className="btn-primary">
            <Save className="h-4 w-4" /> {saving ? "保存中…" : "保存计划"}
          </button>
        </div>
      </div>

      {/* 周日历 */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {schedule.map((d) => {
          const isActive = activeDay === d.day;
          const entries = dayEntries(d.day);
          return (
            <div
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={cn("card flex flex-col transition-all cursor-pointer", isActive ? "ring-2 ring-teal-500 shadow-lift" : "hover:shadow-soft")}
            >
              <div className={cn("flex items-center justify-between px-3 py-2.5 border-b border-line", isActive ? "bg-teal-500 text-cream-50" : "")}>
                <span className={cn("text-sm font-medium", isActive ? "" : "text-ink")}>{DAY_LABEL[d.day]}</span>
                <span className={cn("text-2xs", isActive ? "text-cream-50/70" : "text-ink-faint")}>{entries.length}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[160px]">
                {entries.map((e, i) => {
                  const ex = exercises.find((x) => x.id === e.exerciseId);
                  if (!ex) return null;
                  return (
                    <div key={i} className="rounded border border-line bg-cream-50/60 p-2 group relative">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-medium text-ink leading-tight pr-3">{ex.title}</p>
                        <button onClick={(ev) => { ev.stopPropagation(); removeEntry(d.day, i); }} className="text-ink-faint hover:text-coral opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-2xs text-ink-mute mt-0.5">{ex.bodyPart} · {ex.goal}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <label className="text-2xs text-ink-mute">组</label>
                        <input
                          type="number"
                          value={e.sets}
                          onClick={(ev) => ev.stopPropagation()}
                          onChange={(ev) => updateEntry(d.day, i, { sets: Math.max(1, +ev.target.value) })}
                          className="w-8 rounded border border-line bg-surface px-1 py-0.5 text-2xs text-center stat-num"
                        />
                        <label className="text-2xs text-ink-mute">×</label>
                        <input
                          type="number"
                          value={e.reps}
                          onClick={(ev) => ev.stopPropagation()}
                          onChange={(ev) => updateEntry(d.day, i, { reps: Math.max(1, +ev.target.value) })}
                          className="w-10 rounded border border-line bg-surface px-1 py-0.5 text-2xs text-center stat-num"
                        />
                      </div>
                      <input
                        placeholder="负荷/备注"
                        value={e.load ?? ""}
                        onClick={(ev) => ev.stopPropagation()}
                        onChange={(ev) => updateEntry(d.day, i, { load: ev.target.value })}
                        className="mt-1.5 w-full rounded border border-line bg-surface px-1.5 py-0.5 text-2xs text-ink-mute"
                      />
                    </div>
                  );
                })}
                <button
                  onClick={(ev) => { ev.stopPropagation(); setActiveDay(d.day); setDrawerOpen(true); }}
                  className={cn("w-full rounded border border-dashed py-2 text-2xs flex items-center justify-center gap-1 transition-colors", isActive ? "border-teal-400 text-teal-500 hover:bg-teal-50" : "border-line text-ink-faint hover:text-teal-500 hover:border-teal-300")}
                >
                  <Plus className="h-3 w-3" /> 添加动作
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 动作库抽屉 */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <div className="absolute inset-0 bg-teal-900/25 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[min(92vw,420px)] bg-cream-50 border-l border-line shadow-lift animate-fade-up flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-teal-500" />
                <h3 className="font-display text-lg text-ink">动作库</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xs text-ink-mute">添加到 <span className="text-teal-500 font-medium">{DAY_LABEL[activeDay]}</span></span>
                <button onClick={() => setDrawerOpen(false)} className="text-ink-faint hover:text-ink-mute"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="px-5 py-3 border-b border-line">
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
                <input className="input pl-8" placeholder="搜索动作/目标" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setFilter("")} className={cn("chip", !filter && "chip-active")}>全部</button>
                {BODY_PARTS.map((b) => (
                  <button key={b} onClick={() => setFilter(b)} className={cn("chip", filter === b && "chip-active")}>{b}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredEx.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex)}
                  className="w-full text-left rounded border border-line bg-surface p-3 hover:border-teal-400 hover:bg-teal-50/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink">{ex.title}</span>
                    <span className="chip text-2xs">{ex.bodyPart}</span>
                  </div>
                  <p className="text-2xs text-ink-mute mt-1">目标：{ex.goal} · 默认 {ex.defaultSets}×{ex.defaultReps}</p>
                  <p className="text-2xs text-teal-500/80 mt-1.5 flex items-start gap-1"><Check className="h-3 w-3 mt-0.5 shrink-0" />{ex.cue}</p>
                </button>
              ))}
              {filteredEx.length === 0 && <p className="text-2xs text-ink-faint text-center py-8">无匹配动作</p>}
            </div>
          </div>
        </div>
      )}

      {/* 康复路径参考 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Route className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">康复路径参考</h2>
          <span className="text-2xs text-ink-mute">从急性期到重返运动的决策流程</span>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          {REHAB_STAGES.map((stage, idx) => (
            <div key={idx} className="rounded border border-line bg-surface p-3 relative">
              <div className="absolute -top-2 left-3 bg-teal-500 text-cream-50 text-2xs px-1.5 py-0.5 rounded">{stage.stage}</div>
              <p className="text-2xs text-teal-600 mt-3 font-medium">{stage.time}</p>
              <p className="text-2xs text-ink-mute mt-1.5 leading-relaxed">{stage.coreMeasures}</p>
              <div className="mt-2 rounded bg-cream-100 px-2 py-1 text-2xs text-ink-soft">
                目标：{stage.goal}
              </div>
              <div className="mt-1 rounded bg-teal-50 px-2 py-1 text-2xs text-teal-600">
                判断：{stage.keyJudgment}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 重返运动测试矩阵 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-coral" />
          <h2 className="section-title">重返运动测试矩阵</h2>
          <span className="text-2xs text-ink-mute">客观化 RTS 决策标准</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead>
              <tr className="border-b border-line text-left text-ink-mute">
                <th className="py-2 pr-3 font-medium">测试类别</th>
                <th className="py-2 pr-3 font-medium">测试名称</th>
                <th className="py-2 pr-3 font-medium">阈值 / 目标</th>
                <th className="py-2 pr-3 font-medium text-center">腘绳肌</th>
                <th className="py-2 pr-3 font-medium text-center">股四头肌</th>
                <th className="py-2 pr-3 font-medium text-center">踝扭伤</th>
                <th className="py-2 pr-3 font-medium text-center">肩袖</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {RETURN_STANDARDS.map((row, i) => (
                <tr key={i} className="hover:bg-cream-50/60">
                  <td className="py-2 pr-3 text-ink font-medium">{row.category}</td>
                  <td className="py-2 pr-3 text-ink">{row.test}</td>
                  <td className="py-2 pr-3 text-teal-600">{row.threshold}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.hamstring}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.quadriceps}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.ankle}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.rotatorCuff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 急性期处理对比 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Thermometer className="h-4 w-4 text-amber-dark" />
          <h2 className="section-title">急性期处理对比</h2>
          <span className="text-2xs text-ink-mute">PEACE & LOVE vs RICE vs POLICE</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead>
              <tr className="border-b border-line text-left text-ink-mute">
                <th className="py-2 pr-3 font-medium">原则</th>
                <th className="py-2 pr-3 font-medium">年份</th>
                <th className="py-2 pr-3 font-medium text-center">冰敷</th>
                <th className="py-2 pr-3 font-medium text-center">抗炎药</th>
                <th className="py-2 pr-3 font-medium text-center">休息</th>
                <th className="py-2 pr-3 font-medium text-center">负荷</th>
                <th className="py-2 pr-3 font-medium text-center">加压</th>
                <th className="py-2 pr-3 font-medium text-center">抬高</th>
                <th className="py-2 pr-3 font-medium text-center">教育</th>
                <th className="py-2 pr-3 font-medium text-center">心理</th>
                <th className="py-2 pr-3 font-medium text-center">运动</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ACUTE_COMPARE.map((row, i) => (
                <tr key={i} className="hover:bg-cream-50/60">
                  <td className="py-2 pr-3 text-ink font-medium">{row.principle}</td>
                  <td className="py-2 pr-3 text-ink-mute">{row.year}</td>
                  <td className={cn("py-2 pr-3 text-center", row.ice === "0" ? "text-coral" : row.ice === "3" ? "text-teal-600" : "text-ink-mute")}>{row.ice}</td>
                  <td className={cn("py-2 pr-3 text-center", row.antiInflammatory === "0" ? "text-coral" : row.antiInflammatory === "3" ? "text-teal-600" : "text-ink-mute")}>{row.antiInflammatory}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.rest}</td>
                  <td className={cn("py-2 pr-3 text-center", row.load === "3" ? "text-teal-600" : "text-ink-mute")}>{row.load}</td>
                  <td className={cn("py-2 pr-3 text-center", row.compression === "3" ? "text-teal-600" : "text-ink-mute")}>{row.compression}</td>
                  <td className="py-2 pr-3 text-center text-ink-mute">{row.elevation}</td>
                  <td className={cn("py-2 pr-3 text-center", row.education === "3" ? "text-teal-600" : "text-ink-mute")}>{row.education}</td>
                  <td className={cn("py-2 pr-3 text-center", row.psychology === "3" ? "text-teal-600" : "text-ink-mute")}>{row.psychology}</td>
                  <td className={cn("py-2 pr-3 text-center", row.exercise === "3" ? "text-teal-600" : "text-ink-mute")}>{row.exercise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-2xs text-ink-mute mt-3 bg-amber-soft/20 rounded p-2">
          {ACUTE_COMPARE_NOTE}
        </p>
      </section>
    </div>
  );
}
