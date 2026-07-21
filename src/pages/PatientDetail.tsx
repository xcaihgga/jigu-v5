import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Stethoscope, CalendarPlus, Route, ClipboardList, CalendarRange, ArrowRight, ClipboardPaste, Wand2, Save, Edit3, Check, Activity, CalendarClock } from "lucide-react";
import { assess, patient, pathway, plan, progress as progressSvc } from "@/services";
import { fmtDate, relativeTime } from "@/lib/storage";
import { parsePatient } from "@/lib/text-parser";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import GradeBadge from "@/components/ui/GradeBadge";
import CategoryIcon, { CATEGORY_META } from "@/components/CategoryIcon";
import ProgressRing from "@/components/ui/ProgressRing";
import { toast } from "@/store/ui";
import type { Category, Patient } from "@/lib/types";

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const p = patientId ? patient.get(patientId) : undefined;
  const [editOpen, setEditOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const records = useMemo(() => (patientId ? assess.listRecords(patientId) : []), [patientId, tick]);
  const plans = useMemo(() => (patientId ? plan.list(patientId) : []), [patientId, tick]);
  const states = useMemo(() => (patientId ? pathway.statesByPatient(patientId) : []), [patientId, tick]);
  const suggestions = useMemo(() => (patientId ? pathway.recommend(patientId) : []), [patientId, tick]);

  if (!p) {
    return <EmptyState title="患者不存在" action={<button onClick={() => navigate("/patients")} className="btn-ghost btn-sm">返回列表</button>} />;
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate("/patients")} className="inline-flex items-center gap-1 text-2xs text-ink-mute hover:text-teal-500">
        <ArrowLeft className="h-3 w-3" /> 患者列表
      </button>

      {/* 档案头 */}
      <div className="card p-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-teal-500 text-cream-50 text-xl font-medium">{p.name.slice(0, 1)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl text-ink">{p.name}</h1>
              <span className="text-sm text-ink-mute">{p.age}岁 · {p.sex}</span>
              <CategoryIcon category={p.category} />
              <span className="chip text-2xs">{CATEGORY_META[p.category].name}</span>
            </div>
            <p className="text-sm text-ink-soft mt-1">{p.diagnosis}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {p.tags.map((t) => <span key={t} className="chip text-2xs">{t}</span>)}
            </div>
            <p className="text-2xs text-ink-faint mt-2">建档于 {fmtDate(p.createdAt)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate("/assess")} className="btn-primary btn-sm"><Stethoscope className="h-3.5 w-3.5" /> 发起评估</button>
            <button onClick={() => navigate("/plan")} className="btn-ghost btn-sm"><CalendarPlus className="h-3.5 w-3.5" /> 生成计划</button>
            <button onClick={() => setEditOpen(true)} className="btn-ghost btn-sm"><Edit3 className="h-3.5 w-3.5" /> 编辑档案</button>
          </div>
        </div>
      </div>

      {/* 概览卡 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "评估次数", value: records.length, icon: ClipboardList, to: "" },
          { label: "康复计划", value: plans.length, icon: CalendarRange, to: "/plan" },
          { label: "启用路径", value: states.length, icon: Route, to: "/pathway" },
        ].map((s) => (
          <button key={s.label} onClick={() => s.to && navigate(s.to)} className="card p-4 text-left hover:shadow-soft transition-all">
            <s.icon className="h-4 w-4 text-teal-500" strokeWidth={1.7} />
            <p className="stat-num text-2xl text-ink mt-2">{s.value}</p>
            <p className="text-2xs text-ink-mute">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* 评估历史 */}
        <div className="card p-5">
          <h2 className="section-title mb-4">评估历史</h2>
          {records.length === 0 ? (
            <p className="text-2xs text-ink-faint py-6 text-center">暂无评估记录</p>
          ) : (
            <div className="divide-y divide-line">
              {records.map((r) => (
                <button key={r.id} onClick={() => navigate(`/assess/${r.scaleId}/report/${r.id}`)} className="w-full flex items-center gap-3 py-3 text-left hover:bg-cream-50/60 -mx-2 px-2 rounded">
                  <CategoryIcon category={r.category} className="h-3.5 w-3.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">{r.scaleTitle}</p>
                    <p className="text-2xs text-ink-mute">{relativeTime(r.takenAt)}</p>
                  </div>
                  <span className="stat-num text-sm text-ink">{r.totalScore}<span className="text-2xs text-ink-faint">/{r.maxScore}</span></span>
                  <GradeBadge grade={r.grade} tone={r.tone} size="sm" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 进行中的路径（已迁移自康复计划） */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title inline-flex items-center gap-2"><Route className="h-4 w-4 text-teal-500" /> 进行中的路径</h2>
            <button onClick={() => navigate("/plan")} className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1">管理 <ArrowRight className="h-3 w-3" /></button>
          </div>
          {states.length === 0 ? (
            <div>
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-2xs text-ink-mute mb-2">基于诊断推荐</p>
                  {suggestions.slice(0, 3).map((s) => (
                    <button key={s.pathway.id} onClick={() => navigate("/plan")} className="w-full text-left rounded border border-line p-3 hover:border-teal-400 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-ink flex-1 truncate">{s.pathway.title}</span>
                        <span className="stat-num text-2xs text-coral shrink-0">{s.fit}%</span>
                      </div>
                      <p className="text-2xs text-ink-mute mt-0.5 line-clamp-1">{s.pathway.summary}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-2xs text-ink-faint py-6 text-center">暂无启用路径，可到康复计划中预览选择</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {states.map((st) => {
                const pw = pathway.get(st.pathwayId);
                if (!pw) return null;
                const stage = pw.stages[st.currentStage];
                return (
                  <div key={st.id} className="rounded border border-line p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-ink flex-1">{pw.title}</p>
                      {st.currentStage < pw.stages.length - 1 && (
                        <button
                          onClick={() => { pathway.advance(p.id, pw.id); toast.success("已推进下一阶段"); setTick((t) => t + 1); }}
                          className="text-2xs text-coral hover:underline shrink-0 inline-flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" /> 达标推进
                        </button>
                      )}
                    </div>
                    <p className="text-2xs text-ink-mute">当前：<span className="text-teal-600 font-medium">{stage?.title}</span>（{stage?.window}）</p>
                    <p className="text-2xs text-ink-faint mt-0.5 line-clamp-1">目标：{stage?.goal}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {pw.stages.map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= st.currentStage ? "bg-teal-500" : "bg-cream-200"}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 进行中的计划（已迁移自康复计划） */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title inline-flex items-center gap-2">
            <Activity className="h-4 w-4 text-coral" /> 进行中的计划
          </h2>
          <button onClick={() => navigate("/plan")} className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1">查看全部 <ArrowRight className="h-3 w-3" /></button>
        </div>
        {plans.length === 0 ? (
          <p className="text-2xs text-ink-faint py-6 text-center">暂无康复计划，<button onClick={() => navigate("/assess")} className="text-teal-500 hover:underline">去评估生成</button></p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {plans.map((pl) => {
              const planCr = progressSvc.completionRate(pl.id, 14);
              const totalEntries = pl.schedule.reduce((acc, d) => acc + d.entries.length, 0);
              return (
                <button key={pl.id} onClick={() => navigate(`/plan/${pl.id}`)} className="text-left rounded border border-line p-4 hover:border-teal-400 hover:shadow-soft transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        {pl.active && <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-1.5 py-0.5 text-2xs text-teal-600"><span className="h-1 w-1 rounded-full bg-teal-500" />执行中</span>}
                        <span className="text-2xs text-ink-mute">{fmtDate(pl.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium text-ink truncate">{pl.title}</p>
                    </div>
                    <ProgressRing value={planCr.rate} size={42} />
                  </div>
                  <p className="text-2xs text-ink-mute line-clamp-1">{pl.goal}</p>
                  <div className="mt-2 flex items-center gap-3 text-2xs text-ink-faint">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{pl.durationWeeks}周</span>
                    <span>·</span>
                    <span>{totalEntries} 项动作</span>
                    <span>·</span>
                    <span>完成 {planCr.doneDays}/{planCr.plannedDays}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <EditPatientModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        patient={p}
        onSaved={() => { setEditOpen(false); setTick((t) => t + 1); }}
      />
    </div>
  );
}

function EditPatientModal({
  open,
  onClose,
  patient: p,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  patient: Patient;
  onSaved: () => void;
}) {
  const [name, setName] = useState(p.name);
  const [age, setAge] = useState(String(p.age));
  const [sex, setSex] = useState<"男" | "女">(p.sex);
  const [diagnosis, setDiagnosis] = useState(p.diagnosis);
  const [category, setCategory] = useState<Category>(p.category);
  const [tags, setTags] = useState(p.tags.join("，"));
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  // 当外部 patient 变化时重置表单
  useEffect(() => {
    setName(p.name);
    setAge(String(p.age));
    setSex(p.sex);
    setDiagnosis(p.diagnosis);
    setCategory(p.category);
    setTags(p.tags.join("，"));
  }, [p]);

  const save = () => {
    if (!name.trim() || !diagnosis.trim()) {
      toast.error("请填写姓名与诊断");
      return;
    }
    patient.update(p.id, {
      name,
      age: +age || 0,
      sex,
      diagnosis,
      category,
      tags: tags.split(/[,，\s]+/).filter(Boolean),
    });
    toast.success("档案已更新");
    onSaved();
  };

  const applyParsed = () => {
    const parsed = parsePatient(pasteText);
    if (parsed.name) setName(parsed.name);
    if (typeof parsed.age === "number") setAge(String(parsed.age));
    if (parsed.sex) setSex(parsed.sex);
    if (parsed.diagnosis) setDiagnosis(parsed.diagnosis);
    if (parsed.category) setCategory(parsed.category);
    if (Array.isArray(parsed.tags)) {
      const merged = Array.from(new Set([...tags.split(/[,，\s]+/).filter(Boolean), ...parsed.tags]));
      setTags(merged.join("，"));
    }
    setPasteOpen(false);
    toast.success("已从粘贴内容识别字段");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={`编辑档案 · ${p.name}`}
        footer={
          <>
            <button onClick={onClose} className="btn-ghost btn-sm">取消</button>
            <button onClick={save} className="btn-primary btn-sm"><Save className="h-3.5 w-3.5" /> 保存</button>
          </>
        }
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setPasteOpen(true)} className="btn-ghost btn-sm text-2xs">
              <ClipboardPaste className="h-3.5 w-3.5" /> 智能粘贴更新
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-text">姓名</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label className="label-text">年龄</label><input className="input" type="number" value={age} onChange={(e) => setAge(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text">性别</label>
              <div className="flex rounded border border-line p-0.5 text-sm">
                {(["男", "女"] as const).map((s) => (
                  <button key={s} onClick={() => setSex(s)} className={`flex-1 rounded py-1.5 ${sex === s ? "bg-teal-500 text-cream-50" : "text-ink-mute"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label-text">亚专科</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {(Object.keys(CATEGORY_META) as Category[]).map((c) => <option key={c} value={c}>{CATEGORY_META[c].name}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label-text">诊断</label><input className="input" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></div>
          <div><label className="label-text">标签 <span className="lowercase tracking-normal text-ink-faint">（逗号分隔）</span></label><input className="input" value={tags} onChange={(e) => setTags(e.target.value)} /></div>
        </div>
      </Modal>

      <Modal
        open={pasteOpen}
        onClose={() => setPasteOpen(false)}
        title="智能粘贴识别"
        size="lg"
        footer={
          <>
            <button onClick={() => setPasteText("")} className="btn-ghost btn-sm">清空</button>
            <button onClick={() => setPasteOpen(false)} className="btn-ghost btn-sm">取消</button>
            <button onClick={applyParsed} disabled={!pasteText.trim()} className="btn-primary btn-sm disabled:opacity-50">
              <Wand2 className="h-3.5 w-3.5" /> 解析并填充
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-mute mb-2">粘贴一段主诉/现病史/查体文字，识别后仅覆盖匹配字段。</p>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder="示例：&#10;姓名：李四&#10;女，58 岁&#10;电话 13900002222&#10;主诉：腰部疼痛 2 周&#10;现病史：弯腰加重，伴左下肢放射痛…&#10;诊断：腰椎间盘突出"
          className="input min-h-[200px] font-mono text-2xs leading-relaxed"
        />
      </Modal>
    </>
  );
}
