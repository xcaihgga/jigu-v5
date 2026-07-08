import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarRange, Plus, Edit3, Trash2, Save, X, User, Clock, Target, Search,
  Filter, ChevronDown, ChevronUp, ListChecks, BookOpen, Sparkles, TrendingUp
} from "lucide-react";
import { plan, patient, assess } from "@/services";
import type { Plan, PlanEntry } from "@/lib/types";
import { fmtDate } from "@/lib/storage";
import { toast } from "@/store/ui";
import EmptyState from "@/components/ui/EmptyState";
import ProgressRing from "@/components/ui/ProgressRing";

const DAY_LABEL = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-teal-50 border-teal-300 text-teal-700",
  paused: "bg-amber-50 border-amber-300 text-amber-700",
  completed: "bg-cream-200 border-line text-ink-soft",
  draft: "bg-cream-200 border-line text-ink-mute",
};

const STATUS_LABEL: Record<string, string> = {
  active: "进行中",
  paused: "已暂停",
  completed: "已完成",
  draft: "草稿",
};

export default function TreatmentPlanPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPatient, setFilterPatient] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "durationWeeks" | "title">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});

  const reload = () => {
    setPlans(plan.list());
  };

  useEffect(() => {
    reload();
  }, []);

  const patients = useMemo(() => patient.list(), []);

  const filtered = useMemo(() => {
    let arr = plans;
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter((p) => p.title.toLowerCase().includes(s) || p.patientName.toLowerCase().includes(s) || (p.goal || "").toLowerCase().includes(s));
    }
    if (filterStatus !== "all") arr = arr.filter((p) => (p.status || "active") === filterStatus);
    if (filterPatient !== "all") arr = arr.filter((p) => p.patientId === filterPatient);
    arr = [...arr].sort((a, b) => {
      let va: any, vb: any;
      if (sortBy === "title") { va = a.title; vb = b.title; }
      else if (sortBy === "durationWeeks") { va = a.durationWeeks; vb = b.durationWeeks; }
      else { va = a.createdAt; vb = b.createdAt; }
      const cmp = typeof va === "string" ? va.localeCompare(vb) : (va as number) - (vb as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [plans, search, filterStatus, filterPatient, sortBy, sortDir]);

  const stats = useMemo(() => {
    return {
      total: plans.length,
      active: plans.filter((p) => (p.status || "active") === "active").length,
      completed: plans.filter((p) => p.status === "completed").length,
      avgWeeks: plans.length ? Math.round(plans.reduce((s, p) => s + (p.durationWeeks || 0), 0) / plans.length) : 0,
    };
  }, [plans]);

  const startEdit = (p: Plan) => {
    setEditingId(p.id);
    setEditForm({
      title: p.title,
      goal: p.goal,
      durationWeeks: p.durationWeeks,
      status: (p.status as any) || "active",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    plan.update(id, editForm);
    toast.success("计划已更新");
    setEditingId(null);
    setEditForm({});
    reload();
  };

  const removePlan = (id: string) => {
    if (!confirm("确定要删除此计划吗？此操作不可撤销。")) return;
    const all = JSON.parse(localStorage.getItem("plans") || "[]");
    const next = all.filter((p: Plan) => p.id !== id);
    localStorage.setItem("plans", JSON.stringify(next));
    toast.success("计划已删除");
    reload();
  };

  const updateEntry = (planId: string, day: number, idx: number, patch: Partial<PlanEntry>) => {
    const p = plans.find((x) => x.id === planId);
    if (!p) return;
    const newSchedule = p.schedule.map((s) => {
      if (s.day !== day) return s;
      const newEntries = [...s.entries];
      newEntries[idx] = { ...newEntries[idx], ...patch };
      return { ...s, entries: newEntries };
    });
    plan.update(planId, { schedule: newSchedule });
    reload();
  };

  const removeEntry = (planId: string, day: number, idx: number) => {
    const p = plans.find((x) => x.id === planId);
    if (!p) return;
    const newSchedule = p.schedule.map((s) => {
      if (s.day !== day) return s;
      return { ...s, entries: s.entries.filter((_, i) => i !== idx) };
    });
    plan.update(planId, { schedule: newSchedule });
    reload();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Treatment Plan Hub</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">康复治疗计划 · 汇总</h1>
          <p className="text-sm text-ink-mute mt-1">展示所有康复计划，可编辑修改，支持筛选与排序</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/assess")} className="btn-primary">
            <Plus className="h-4 w-4" /> 从评估生成计划
          </button>
        </div>
      </header>

      {/* 统计卡片 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-teal-50 text-teal-600">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xs text-ink-mute">计划总数</p>
            <p className="font-display text-xl text-ink stat-num">{stats.total}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-teal-50 text-teal-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xs text-ink-mute">进行中</p>
            <p className="font-display text-xl text-ink stat-num">{stats.active}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-amber-50 text-amber-700">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xs text-ink-mute">已完成</p>
            <p className="font-display text-xl text-ink stat-num">{stats.completed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="h-10 w-10 grid place-items-center rounded-lg bg-coral-50 text-coral">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xs text-ink-mute">平均周期</p>
            <p className="font-display text-xl text-ink stat-num">{stats.avgWeeks}<span className="text-sm text-ink-mute ml-1">周</span></p>
          </div>
        </div>
      </section>

      {/* 筛选 + 搜索 */}
      <section className="card p-4 flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <input
            className="input pl-8"
            placeholder="搜索计划标题 / 患者 / 目标"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-2xs text-ink-mute inline-flex items-center gap-1"><Filter className="h-3 w-3" /> 状态</span>
          {["all", "active", "paused", "completed", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`chip text-2xs ${filterStatus === s ? "chip-active" : ""}`}
            >
              {s === "all" ? "全部" : STATUS_LABEL[s] || s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-2xs text-ink-mute inline-flex items-center gap-1"><User className="h-3 w-3" /> 患者</span>
          <button
            onClick={() => setFilterPatient("all")}
            className={`chip text-2xs ${filterPatient === "all" ? "chip-active" : ""}`}
          >全部</button>
          {patients.slice(0, 5).map((p) => (
            <button
              key={p.id}
              onClick={() => setFilterPatient(p.id)}
              className={`chip text-2xs ${filterPatient === p.id ? "chip-active" : ""}`}
            >{p.name}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap ml-auto">
          <span className="text-2xs text-ink-mute">排序</span>
          <button
            onClick={() => { setSortBy("createdAt"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
            className={`chip text-2xs ${sortBy === "createdAt" ? "chip-active" : ""}`}
          >创建时间 {sortBy === "createdAt" && (sortDir === "asc" ? "↑" : "↓")}</button>
          <button
            onClick={() => { setSortBy("durationWeeks"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
            className={`chip text-2xs ${sortBy === "durationWeeks" ? "chip-active" : ""}`}
          >周期 {sortBy === "durationWeeks" && (sortDir === "asc" ? "↑" : "↓")}</button>
          <button
            onClick={() => { setSortBy("title"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
            className={`chip text-2xs ${sortBy === "title" ? "chip-active" : ""}`}
          >标题 {sortBy === "title" && (sortDir === "asc" ? "↑" : "↓")}</button>
        </div>
      </section>

      {/* 计划列表 */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CalendarRange className="h-10 w-10" />}
            title="暂无计划"
            desc="从评估中心发起评估，将自动生成康复计划"
            action={
              <button onClick={() => navigate("/assess")} className="btn-primary btn-sm">
                <Plus className="h-3.5 w-3.5" /> 发起评估
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const isEditing = editingId === p.id;
            const isExpanded = expandedId === p.id;
            const status = (p.status || "active") as string;
            const totalEntries = p.schedule.reduce((s, d) => s + d.entries.length, 0);
            return (
              <div key={p.id} className="card overflow-hidden">
                {/* 标题行 */}
                <div className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 grid place-items-center rounded-lg bg-cream-200 text-ink-soft shrink-0">
                    <CalendarRange className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        className="input mb-2"
                        value={editForm.title || ""}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    ) : (
                      <h3 className="font-display text-lg text-ink leading-tight">{p.title}</h3>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-2xs text-ink-mute flex-wrap">
                      <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{p.patientName}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(p.createdAt)}</span>
                      <span className={`chip text-2xs ${STATUS_COLORS[status] || STATUS_COLORS.active}`}>
                        {STATUS_LABEL[status] || status}
                      </span>
                      <span className="chip text-2xs bg-cream-200 border-line text-ink-soft">
                        {p.durationWeeks}周 · {totalEntries}动作
                      </span>
                    </div>
                    {isEditing ? (
                      <textarea
                        className="input mt-2 min-h-[60px]"
                        value={editForm.goal || ""}
                        onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })}
                        placeholder="康复目标"
                      />
                    ) : (
                      p.goal && <p className="text-sm text-ink-soft mt-2">{p.goal}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <select
                          className="input text-2xs py-1"
                          value={editForm.status as string}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        >
                          <option value="active">进行中</option>
                          <option value="paused">已暂停</option>
                          <option value="completed">已完成</option>
                          <option value="draft">草稿</option>
                        </select>
                        <input
                          type="number"
                          min={1}
                          max={52}
                          className="input text-2xs py-1 w-16"
                          value={editForm.durationWeeks || 0}
                          onChange={(e) => setEditForm({ ...editForm, durationWeeks: parseInt(e.target.value) || 1 })}
                        />
                        <button onClick={() => saveEdit(p.id)} className="btn-primary btn-sm">
                          <Save className="h-3.5 w-3.5" /> 保存
                        </button>
                        <button onClick={cancelEdit} className="btn-ghost btn-sm">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(p)} className="btn-ghost btn-sm" title="编辑">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => removePlan(p.id)} className="btn-ghost btn-sm text-coral" title="删除">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => navigate(`/plan/${p.id}`)} className="btn-ghost btn-sm">
                          <BookOpen className="h-3.5 w-3.5" /> 详情
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 周期进度 */}
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-2xs text-ink-mute mb-1">
                        <span>周计划排程</span>
                        <span>{p.schedule.filter((d) => d.entries.length > 0).length} / 7 天有训练</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {p.schedule.map((d) => (
                          <div
                            key={d.day}
                            className={`h-2 rounded-full ${
                              d.entries.length > 0 ? "bg-teal-500" : "bg-cream-200"
                            }`}
                            title={`${DAY_LABEL[d.day]} - ${d.entries.length} 动作`}
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className="btn-ghost btn-sm"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {isExpanded ? "收起" : "展开"}
                    </button>
                  </div>
                </div>

                {/* 展开的周计划明细 */}
                {isExpanded && (
                  <div className="border-t border-line bg-cream-50/40 p-4 space-y-3">
                    {p.schedule.map((d) => {
                      const exs = d.entries.map((e) => plan.getExercise(e.exerciseId)).filter(Boolean);
                      return (
                        <div key={d.day} className="rounded border border-line bg-white/70 p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="h-7 w-7 grid place-items-center rounded-full bg-teal-50 text-teal-700 text-2xs font-medium">
                              {DAY_LABEL[d.day]}
                            </span>
                            <span className="text-sm text-ink-soft">{d.entries.length} 个动作</span>
                          </div>
                          {d.entries.length === 0 ? (
                            <p className="text-2xs text-ink-faint">休息日</p>
                          ) : (
                            <div className="space-y-1.5">
                              {d.entries.map((entry, idx) => {
                                const ex = plan.getExercise(entry.exerciseId);
                                return (
                                  <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Sparkles className="h-3 w-3 text-amber-dark shrink-0" />
                                    <span className="flex-1 text-ink-soft truncate">
                                      {ex?.name || entry.exerciseId}
                                    </span>
                                    <input
                                      type="number"
                                      min={1}
                                      max={20}
                                      className="input text-2xs py-0.5 w-12 text-center"
                                      value={entry.sets}
                                      onChange={(e) => updateEntry(p.id, d.day, idx, { sets: parseInt(e.target.value) || 1 })}
                                    />
                                    <span className="text-2xs text-ink-mute">组 ×</span>
                                    <input
                                      type="number"
                                      min={1}
                                      max={50}
                                      className="input text-2xs py-0.5 w-12 text-center"
                                      value={entry.reps}
                                      onChange={(e) => updateEntry(p.id, d.day, idx, { reps: parseInt(e.target.value) || 1 })}
                                    />
                                    <span className="text-2xs text-ink-mute">次</span>
                                    <button
                                      onClick={() => removeEntry(p.id, d.day, idx)}
                                      className="h-6 w-6 grid place-items-center rounded text-coral hover:bg-coral-50"
                                      title="删除动作"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
