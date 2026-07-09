import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope, Search, ChevronRight, AlertCircle, Target, BookOpen,
  Shield, Activity, MapPin, CheckCircle2, X, Layers, Sparkles, CalendarRange,
  Plus, Edit3, Trash2, Save, User, Clock, Filter, ListChecks, TrendingUp
} from "lucide-react";
import { plan, patient, assess } from "@/services";
import { PAIN_CONDITIONS, PAIN_CATEGORIES, searchPain, type PainCondition } from "@/data/pain-treatments";
import type { Plan, PlanEntry } from "@/lib/types";
import { fmtDate } from "@/lib/storage";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

const DAY_LABEL = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const EVIDENCE_COLORS: Record<string, string> = {
  A: "bg-teal-100 text-teal-700 border-teal-300",
  B: "bg-amber-50 text-amber-700 border-amber-300",
  C: "bg-cream-200 text-ink-soft border-line",
};
const EVIDENCE_LABELS: Record<string, string> = {
  A: "A 级证据",
  B: "B 级证据",
  C: "C 级证据",
};
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

export default function TreatmentHubPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"pain" | "plan">("pain");
  
  const [painKeyword, setPainKeyword] = useState("");
  const [painCategory, setPainCategory] = useState<string>("all");
  const [selectedPain, setSelectedPain] = useState<PainCondition | null>(null);
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planSearch, setPlanSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPatient, setFilterPatient] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "durationWeeks" | "title">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});

  const reloadPlans = () => { setPlans(plan.list()); };
  useEffect(() => { reloadPlans(); }, []);

  const patients = useMemo(() => patient.list(), []);

  const painList = useMemo(() => {
    let arr = painKeyword ? searchPain(painKeyword) : PAIN_CONDITIONS;
    if (painCategory !== "all") arr = arr.filter((c) => c.category === painCategory);
    return arr;
  }, [painKeyword, painCategory]);

  const painGrouped = useMemo(() => {
    const m: Record<string, PainCondition[]> = {};
    painList.forEach((c) => {
      if (!m[c.category]) m[c.category] = [];
      m[c.category].push(c);
    });
    return m;
  }, [painList]);

  const filteredPlans = useMemo(() => {
    let arr = plans;
    if (planSearch) {
      const s = planSearch.toLowerCase();
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
  }, [plans, planSearch, filterStatus, filterPatient, sortBy, sortDir]);

  const planStats = useMemo(() => ({
    total: plans.length,
    active: plans.filter((p) => (p.status || "active") === "active").length,
    completed: plans.filter((p) => p.status === "completed").length,
    avgWeeks: plans.length ? Math.round(plans.reduce((s, p) => s + (p.durationWeeks || 0), 0) / plans.length) : 0,
  }), [plans]);

  const startEdit = (p: Plan) => {
    setEditingId(p.id);
    setEditForm({ title: p.title, goal: p.goal, durationWeeks: p.durationWeeks, status: (p.status as any) || "active" });
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };
  const saveEdit = (id: string) => {
    plan.update(id, editForm);
    toast.success("计划已更新");
    setEditingId(null); setEditForm({}); reloadPlans();
  };
  const removePlan = (id: string) => {
    if (!confirm("确定要删除此计划吗？")) return;
    const all = JSON.parse(localStorage.getItem("plans") || "[]");
    localStorage.setItem("plans", JSON.stringify(all.filter((p: Plan) => p.id !== id)));
    toast.success("计划已删除"); reloadPlans();
  };
  const updateEntry = (planId: string, day: number, idx: number, patch: Partial<PlanEntry>) => {
    const p = plans.find((x) => x.id === planId); if (!p) return;
    const newSchedule = p.schedule.map((s) => {
      if (s.day !== day) return s;
      const newEntries = [...s.entries]; newEntries[idx] = { ...newEntries[idx], ...patch };
      return { ...s, entries: newEntries };
    });
    plan.update(planId, { schedule: newSchedule }); reloadPlans();
  };
  const removeEntry = (planId: string, day: number, idx: number) => {
    const p = plans.find((x) => x.id === planId); if (!p) return;
    const newSchedule = p.schedule.map((s) => {
      if (s.day !== day) return s;
      return { ...s, entries: s.entries.filter((_, i) => i !== idx) };
    });
    plan.update(planId, { schedule: newSchedule }); reloadPlans();
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Treatment Hub</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">治疗方案</h1>
          <p className="text-sm text-ink-mute mt-1">整合肌骨疼痛与骨科术后康复治疗方案，支持搜索、筛选与查看详情</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/assess")} className="btn-primary">
            <Plus className="h-4 w-4" /> 从评估生成计划
          </button>
        </div>
      </header>

      <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("pain")}
          className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "pain" ? "bg-teal-500 text-white" : "text-ink-mute hover:text-ink")}
        >
          <Stethoscope className="h-3.5 w-3.5 inline mr-1" /> 疼痛治疗方案 ({PAIN_CONDITIONS.length})
        </button>
        <button
          onClick={() => setTab("plan")}
          className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
            tab === "plan" ? "bg-teal-500 text-white" : "text-ink-mute hover:text-ink")}
        >
          <CalendarRange className="h-3.5 w-3.5 inline mr-1" /> 康复训练计划 ({plans.length})
        </button>
      </div>

      {tab === "pain" && (
        <div className="space-y-6">
          <div className="card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-coral-100 to-transparent rounded-bl-full opacity-60" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-coral-100 text-coral flex items-center justify-center">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-ink-main">肌骨疼痛与骨科术后康复方案</h2>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
                覆盖足踝、膝、髋、腰、肩、肘、颈及骨科术后康复，
                每种方案包含 <span className="text-coral font-semibold">病因 / 病理分期 / 临床表现 / 评估 / 治疗 / 预防</span> 六大维度。
              </p>
            </div>
          </div>

          <div className="card">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
                <input
                  value={painKeyword}
                  onChange={(e) => setPainKeyword(e.target.value)}
                  placeholder="搜索疾病名、症状、治疗方案…"
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-line bg-cream-100 text-sm focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPainCategory("all")} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                  painCategory === "all" ? "bg-ink-main text-cream-100 border-ink-main" : "bg-cream-100 text-ink-soft border-line hover:border-coral")}>
                  全部 ({PAIN_CONDITIONS.length})
                </button>
                {PAIN_CATEGORIES.map((c) => {
                  const count = PAIN_CONDITIONS.filter((p) => p.category === c.id).length;
                  return (
                    <button key={c.id} onClick={() => setPainCategory(c.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                      painCategory === c.id ? "bg-coral text-white border-coral" : "bg-cream-100 text-ink-soft border-line hover:border-coral")}>
                      {c.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {Object.entries(painGrouped).map(([cat, items]) => (
            <div key={cat} className="card">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-coral" />
                <h2 className="text-lg font-semibold text-ink-main">
                  {PAIN_CATEGORIES.find((c) => c.id === cat)?.name ?? cat}
                </h2>
                <span className="text-xs text-ink-mute">（{items.length} 种）</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((c) => (
                  <button key={c.name} onClick={() => setSelectedPain(c)} className="text-left p-4 rounded-xl border border-line bg-cream-100 hover:bg-cream-200 hover:border-coral transition group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-500" />
                        <span className="text-xs text-ink-mute">{c.region}</span>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded border", EVIDENCE_COLORS[c.evidenceLevel])}>
                        {EVIDENCE_LABELS[c.evidenceLevel]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-ink-main mb-2 group-hover:text-coral transition">{c.name}</h3>
                    {c.symptoms && c.symptoms.length > 0 && (
                      <p className="text-xs text-ink-soft line-clamp-2 mb-2">{c.symptoms[0]}</p>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
                      <span className="text-xs text-ink-mute">{c.treatment.length} 项治疗</span>
                      <ChevronRight className="h-4 w-4 text-ink-mute group-hover:text-coral group-hover:translate-x-1 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {painList.length === 0 && (
            <div className="card text-center py-12 text-ink-mute">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>未找到匹配的疼痛方案</p>
            </div>
          )}

          {selectedPain && (
            <div className="fixed inset-0 bg-ink-main/40 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedPain(null)}>
              <div className="bg-cream-100 rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-gradient-to-r from-coral-50 to-cream-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded border bg-teal-50 text-teal-700 border-teal-200">
                        {selectedPain.region}
                      </span>
                      <span className={cn("text-xs px-2 py-0.5 rounded border", EVIDENCE_COLORS[selectedPain.evidenceLevel])}>
                        {EVIDENCE_LABELS[selectedPain.evidenceLevel]}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-ink-main">{selectedPain.name}</h2>
                  </div>
                  <button onClick={() => setSelectedPain(null)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-cream-200 text-ink-soft">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {selectedPain.causes && selectedPain.causes.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-coral" />
                        <h3 className="font-semibold text-ink-main">病因 / 危险因素</h3>
                      </div>
                      <ul className="space-y-1.5 pl-6">
                        {selectedPain.causes.map((s, i) => <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>)}
                      </ul>
                    </section>
                  )}
                  {selectedPain.stages && selectedPain.stages.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-coral" />
                        <h3 className="font-semibold text-ink-main">病理分期</h3>
                      </div>
                      <ol className="space-y-2 pl-2">
                        {selectedPain.stages.map((s, i) => (
                          <li key={i} className="text-sm text-ink-soft p-3 bg-cream-200 rounded-lg border border-line">
                            <span className="font-medium text-coral">{i + 1}.</span> {s}
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}
                  {selectedPain.symptoms && selectedPain.symptoms.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-coral" />
                        <h3 className="font-semibold text-ink-main">临床表现</h3>
                      </div>
                      <ul className="space-y-1.5 pl-6">
                        {selectedPain.symptoms.map((s, i) => <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>)}
                      </ul>
                    </section>
                  )}
                  {selectedPain.assessment && selectedPain.assessment.length > 0 && (
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-coral" />
                        <h3 className="font-semibold text-ink-main">评估方法</h3>
                      </div>
                      <ul className="space-y-1.5 pl-6">
                        {selectedPain.assessment.map((s, i) => <li key={i} className="text-sm text-ink-soft list-disc">{s}</li>)}
                      </ul>
                    </section>
                  )}
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-coral" />
                      <h3 className="font-semibold text-ink-main">治疗 / 改善方案</h3>
                    </div>
                    <ol className="space-y-1.5 pl-6">
                      {selectedPain.treatment.map((s, i) => <li key={i} className="text-sm text-ink-soft list-decimal">{s}</li>)}
                    </ol>
                  </section>
                  <section>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-coral" />
                      <h3 className="font-semibold text-ink-main">预防</h3>
                    </div>
                    <p className="text-sm text-ink-soft pl-6">{selectedPain.prevention}</p>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "plan" && (
        <div className="space-y-5">
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card p-4 flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-lg bg-teal-50 text-teal-600">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-ink-mute">计划总数</p>
                <p className="font-display text-xl text-ink stat-num">{planStats.total}</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-lg bg-teal-50 text-teal-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-ink-mute">进行中</p>
                <p className="font-display text-xl text-ink stat-num">{planStats.active}</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-lg bg-amber-50 text-amber-700">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-ink-mute">已完成</p>
                <p className="font-display text-xl text-ink stat-num">{planStats.completed}</p>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-lg bg-coral-50 text-coral">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs text-ink-mute">平均周期</p>
                <p className="font-display text-xl text-ink stat-num">{planStats.avgWeeks}<span className="text-sm text-ink-mute ml-1">周</span></p>
              </div>
            </div>
          </section>

          <section className="card p-4 flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
              <input className="input pl-8" placeholder="搜索计划标题 / 患者 / 目标" value={planSearch} onChange={(e) => setPlanSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-2xs text-ink-mute inline-flex items-center gap-1"><Filter className="h-3 w-3" /> 状态</span>
              {["all", "active", "paused", "completed", "draft"].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)} className={`chip text-2xs ${filterStatus === s ? "chip-active" : ""}`}>
                  {s === "all" ? "全部" : STATUS_LABEL[s] || s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-2xs text-ink-mute inline-flex items-center gap-1"><User className="h-3 w-3" /> 患者</span>
              <button onClick={() => setFilterPatient("all")} className={`chip text-2xs ${filterPatient === "all" ? "chip-active" : ""}`}>全部</button>
              {patients.slice(0, 5).map((p) => (
                <button key={p.id} onClick={() => setFilterPatient(p.id)} className={`chip text-2xs ${filterPatient === p.id ? "chip-active" : ""}`}>{p.name}</button>
              ))}
            </div>
          </section>

          {filteredPlans.length === 0 ? (
            <div className="card">
              <EmptyState icon={<CalendarRange className="h-10 w-10" />} title="暂无计划" desc="从评估中心发起评估，将自动生成康复计划" action={
                <button onClick={() => navigate("/assess")} className="btn-primary btn-sm">
                  <Plus className="h-3.5 w-3.5" /> 发起评估
                </button>
              } />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlans.map((p) => {
                const isEditing = editingId === p.id;
                const isExpanded = expandedId === p.id;
                const status = (p.status || "active") as string;
                const totalEntries = p.schedule.reduce((s, d) => s + d.entries.length, 0);
                return (
                  <div key={p.id} className="card overflow-hidden">
                    <div className="p-4 flex items-start gap-3">
                      <div className="h-10 w-10 grid place-items-center rounded-lg bg-cream-200 text-ink-soft shrink-0">
                        <CalendarRange className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input className="input mb-2" value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
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
                          <textarea className="input mt-2 min-h-[60px]" value={editForm.goal || ""} onChange={(e) => setEditForm({ ...editForm, goal: e.target.value })} placeholder="康复目标" />
                        ) : (
                          p.goal && <p className="text-sm text-ink-soft mt-2">{p.goal}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {isEditing ? (
                          <>
                            <select className="input text-2xs py-1" value={editForm.status as string} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}>
                              <option value="active">进行中</option>
                              <option value="paused">已暂停</option>
                              <option value="completed">已完成</option>
                              <option value="draft">草稿</option>
                            </select>
                            <input type="number" min={1} max={52} className="input text-2xs py-1 w-16" value={editForm.durationWeeks || 0} onChange={(e) => setEditForm({ ...editForm, durationWeeks: parseInt(e.target.value) || 1 })} />
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
                    <div className="px-4 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-2xs text-ink-mute mb-1">
                            <span>周计划排程</span>
                            <span>{p.schedule.filter((d) => d.entries.length > 0).length} / 7 天有训练</span>
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {p.schedule.map((d) => (
                              <div key={d.day} className={`h-2 rounded-full ${d.entries.length > 0 ? "bg-teal-500" : "bg-cream-200"}`} title={`${DAY_LABEL[d.day]} - ${d.entries.length} 动作`} />
                            ))}
                          </div>
                        </div>
                        <button onClick={() => setExpandedId(isExpanded ? null : p.id)} className="btn-ghost btn-sm">
                          {isExpanded ? <ChevronRight className="h-3.5 w-3.5 rotate-90" /> : <ChevronRight className="h-3.5 w-3.5" />}
                          {isExpanded ? "收起" : "展开"}
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-line bg-cream-50/40 p-4 space-y-3">
                        {p.schedule.map((d) => {
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
                                        <span className="flex-1 text-ink-soft truncate">{ex?.title || entry.exerciseId}</span>
                                        <input type="number" min={1} max={20} className="input text-2xs py-0.5 w-12 text-center" value={entry.sets} onChange={(e) => updateEntry(p.id, d.day, idx, { sets: parseInt(e.target.value) || 1 })} />
                                        <span className="text-2xs text-ink-mute">组 ×</span>
                                        <input type="number" min={1} max={50} className="input text-2xs py-0.5 w-12 text-center" value={entry.reps} onChange={(e) => updateEntry(p.id, d.day, idx, { reps: parseInt(e.target.value) || 1 })} />
                                        <span className="text-2xs text-ink-mute">次</span>
                                        <button onClick={() => removeEntry(p.id, d.day, idx)} className="h-6 w-6 grid place-items-center rounded text-coral hover:bg-coral-50" title="删除动作">
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
      )}
    </div>
  );
}
