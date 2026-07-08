import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Plus, Dumbbell, Search, X, Check } from "lucide-react";
import { plan as planSvc } from "@/services";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import type { Exercise, PlanEntry } from "@/lib/types";

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
    </div>
  );
}
