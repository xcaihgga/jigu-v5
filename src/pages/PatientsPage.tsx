import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, ArrowRight } from "lucide-react";
import { patient as patientSvc, assess, plan } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { fmtDate, relativeTime } from "@/lib/storage";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import CategoryIcon, { CATEGORY_META } from "@/components/CategoryIcon";
import type { Category } from "@/lib/types";

export default function PatientsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [tick, setTick] = useState(0); // 刷新

  const patients = patientSvc.list(user?.id);
  const allTags = useMemo(() => Array.from(new Set(patients.flatMap((p) => p.tags))), [patients]);

  const filtered = patients.filter((p) => {
    if (q.trim() && !(p.name.includes(q) || p.diagnosis.includes(q))) return false;
    if (tag && !p.tags.includes(tag)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Patient Records</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">患者档案</h1>
          <p className="text-sm text-ink-mute mt-1">共 {patients.length} 位患者，管理档案、评估与计划。</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> 新建患者
        </button>
      </header>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <input className="input pl-8" placeholder="搜索姓名 / 诊断" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTag("")} className={`chip ${!tag && "chip-active"}`}>全部</button>
          {allTags.slice(0, 6).map((t) => (
            <button key={t} onClick={() => setTag(t)} className={`chip ${tag === t && "chip-active"}`}>{t}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><EmptyState icon={<Users className="h-12 w-12" />} title="暂无匹配患者" desc="尝试调整筛选或新建患者档案" action={<button onClick={() => setCreateOpen(true)} className="btn-primary btn-sm">新建患者</button>} /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {filtered.map((p) => {
            const recs = assess.listRecords(p.id);
            const plans = plan.list(p.id);
            const last = recs[0];
            return (
              <button key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="card p-5 text-left hover:shadow-lift hover:-translate-y-0.5 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-teal-500 text-cream-50 font-medium shrink-0">{p.name.slice(0, 1)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-2xs text-ink-mute">{p.age}岁 · {p.sex} · {fmtDate(p.createdAt)}建档</p>
                  </div>
                  <CategoryIcon category={p.category} />
                </div>
                <p className="text-sm text-ink-soft mt-3 line-clamp-1">{p.diagnosis}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0, 3).map((t) => <span key={t} className="chip text-2xs">{t}</span>)}
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-line text-2xs text-ink-mute">
                  <span>{CATEGORY_META[p.category].name}</span>
                  <span>{recs.length} 次评估 · {plans.length} 份计划</span>
                </div>
                {last && <p className="text-2xs text-ink-faint mt-2">最近评估 {relativeTime(last.takenAt)}</p>}
              </button>
            );
          })}
        </div>
      )}

      <CreatePatientModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={(id) => { setCreateOpen(false); setTick((t) => t + 1); navigate(`/patients/${id}`); }} />
      <span className="hidden">{tick}</span>
    </div>
  );
}

function CreatePatientModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"男" | "女">("男");
  const [diagnosis, setDiagnosis] = useState("");
  const [category, setCategory] = useState<Category>("musculo");
  const [tags, setTags] = useState("");

  const submit = () => {
    if (!name.trim() || !diagnosis.trim() || !user) { toast.error("请填写姓名与诊断"); return; }
    const p = patientSvc.create({
      therapistId: user.id,
      name, age: +age || 0, sex, diagnosis, category,
      tags: tags.split(/[,，\s]+/).filter(Boolean),
    });
    toast.success("患者已创建");
    onCreated(p.id);
    setName(""); setAge(""); setDiagnosis(""); setTags("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="新建患者档案"
      footer={<><button onClick={onClose} className="btn-ghost btn-sm">取消</button><button onClick={submit} className="btn-primary btn-sm">创建</button></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label-text">姓名</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="患者姓名" /></div>
          <div><label className="label-text">年龄</label><input className="input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="岁" /></div>
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
        <div><label className="label-text">诊断</label><input className="input" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="如：右侧脑梗死后偏瘫" /></div>
        <div><label className="label-text">标签 <span className="lowercase tracking-normal text-ink-faint">（逗号分隔）</span></label><input className="input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="偏瘫, 上肢功能障碍" /></div>
      </div>
    </Modal>
  );
}
