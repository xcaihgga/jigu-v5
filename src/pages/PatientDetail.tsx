import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Stethoscope, CalendarPlus, Route, ClipboardList, CalendarRange, ArrowRight } from "lucide-react";
import { assess, patient, pathway, plan } from "@/services";
import { fmtDate, relativeTime } from "@/lib/storage";
import EmptyState from "@/components/ui/EmptyState";
import GradeBadge from "@/components/ui/GradeBadge";
import CategoryIcon, { CATEGORY_META } from "@/components/CategoryIcon";

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const p = patientId ? patient.get(patientId) : undefined;

  const records = useMemo(() => (patientId ? assess.listRecords(patientId) : []), [patientId]);
  const plans = useMemo(() => (patientId ? plan.list(patientId) : []), [patientId]);
  const states = useMemo(() => (patientId ? pathway.statesByPatient(patientId) : []), [patientId]);
  const suggestions = useMemo(() => (patientId ? pathway.recommend(patientId) : []), [patientId]);

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

        {/* 路径状态 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">临床路径</h2>
            <button onClick={() => navigate("/pathway")} className="text-2xs text-teal-500 hover:underline inline-flex items-center gap-1">详情 <ArrowRight className="h-3 w-3" /></button>
          </div>
          {states.length === 0 ? (
            suggestions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-2xs text-ink-mute mb-2">推荐路径</p>
                {suggestions.slice(0, 2).map((s) => (
                  <button key={s.pathway.id} onClick={() => navigate("/pathway")} className="w-full text-left rounded border border-line p-3 hover:border-teal-400 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink">{s.pathway.title}</span>
                      <span className="stat-num text-2xs text-coral">{s.fit}%</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : <p className="text-2xs text-ink-faint py-6 text-center">暂无推荐，完成评估后生成</p>
          ) : (
            <div className="space-y-3">
              {states.map((st) => {
                const pw = pathway.get(st.pathwayId);
                if (!pw) return null;
                const stage = pw.stages[st.currentStage];
                return (
                  <div key={st.id} className="rounded border border-line p-3">
                    <p className="text-sm font-medium text-ink">{pw.title}</p>
                    <p className="text-2xs text-ink-mute mt-0.5">当前：{stage?.title}（{stage?.window}）</p>
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

      {/* 计划历史 */}
      {plans.length > 0 && (
        <div className="card p-5">
          <h2 className="section-title mb-4">康复计划</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {plans.map((pl) => (
              <button key={pl.id} onClick={() => navigate(`/plan/${pl.id}`)} className="text-left rounded border border-line p-3.5 hover:border-teal-400 hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">{pl.title}</span>
                  {pl.active && <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-1.5 py-0.5 text-2xs text-teal-600"><span className="h-1 w-1 rounded-full bg-teal-500" />执行中</span>}
                </div>
                <p className="text-2xs text-ink-mute">{fmtDate(pl.createdAt)} · {pl.durationWeeks} 周</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
