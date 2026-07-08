import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Users, ArrowRight, Check, Flag, ChevronRight, Sparkles } from "lucide-react";
import { pathway, patient, assess } from "@/services";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import CategoryIcon from "@/components/CategoryIcon";
import type { Patient } from "@/lib/types";

export default function PathwayPage() {
  const navigate = useNavigate();
  const patients = patient.list();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const current = patients.find((p) => p.id === patientId);

  const suggestions = useMemo(() => (patientId ? pathway.recommend(patientId) : []), [patientId]);
  const states = useMemo(() => (patientId ? pathway.statesByPatient(patientId) : []), [patientId]);
  const records = useMemo(() => (patientId ? assess.listRecords(patientId) : []), [patientId]);

  if (patients.length === 0) {
    return <div className="card"><EmptyState icon={<Users className="h-12 w-12" />} title="暂无患者" desc="请先在患者档案中新建" action={<button onClick={() => navigate("/patients")} className="btn-primary btn-sm">去新建</button>} /></div>;
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Clinical Pathway</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">个性化临床路径</h1>
          <p className="text-sm text-ink-mute mt-1">基于评估分数与诊断标签，推荐循证康复路径与阶段节点。</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-ink-mute" />
          <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className="input w-auto min-w-[200px]">
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.diagnosis}</option>)}
          </select>
        </div>
      </header>

      {/* 患者信息条 */}
      {current && (
        <div className="card p-4 flex items-center gap-4 flex-wrap">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-teal-500 text-cream-50 font-medium">{current.name.slice(0, 1)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">{current.name} <span className="text-2xs text-ink-mute font-normal">{current.age}岁 · {current.sex}</span></p>
            <p className="text-2xs text-ink-mute">{current.diagnosis}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {current.tags.map((t) => <span key={t} className="chip text-2xs">{t}</span>)}
          </div>
        </div>
      )}

      {/* 推荐面板 */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-coral" />
          <h2 className="section-title">推荐路径</h2>
          <span className="text-2xs text-ink-mute">基于诊断与最近评估智能匹配</span>
        </div>
        {suggestions.length === 0 ? (
          <div className="card"><EmptyState title="暂无匹配路径" desc="为该患者完成评估后将生成个性化推荐" action={<button onClick={() => navigate("/assess")} className="btn-primary btn-sm">去评估</button>} /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3 stagger">
            {suggestions.map((s) => {
              const st = pathway.state(patientId, s.pathway.id);
              return (
                <div key={s.pathway.id} className="card p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon category={s.pathway.category} />
                      <span className="chip text-2xs">{s.pathway.stages.length} 阶段</span>
                    </div>
                    <div className="text-right">
                      <p className="stat-num text-lg text-coral">{s.fit}<span className="text-2xs text-ink-faint">%</span></p>
                      <p className="text-2xs text-ink-mute">匹配度</p>
                    </div>
                  </div>
                  <h3 className="font-display text-lg text-ink leading-tight">{s.pathway.title}</h3>
                  <p className="text-sm text-ink-mute mt-1 leading-relaxed">{s.pathway.summary}</p>
                  <p className="text-2xs text-teal-500 mt-2 leading-relaxed">{s.reason}</p>

                  <div className="mt-3 h-1 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-coral" style={{ width: `${s.fit}%` }} />
                  </div>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    {st ? (
                      <>
                        <span className="chip chip-active text-2xs">已启用 · 第 {st.currentStage + 1} 阶段</span>
                        <button onClick={() => navigate(`/pathway?pw=${s.pathway.id}&p=${patientId}`)} className="btn-ghost btn-sm ml-auto">
                          查看路径 <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { pathway.start(patientId, s.pathway.id); toast.success(`已启用「${s.pathway.title}」`); }}
                        className="btn-primary btn-sm ml-auto"
                      >
                        <Route className="h-3.5 w-3.5" /> 启用此路径
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
                            <div className={cn("rounded px-3 py-2 text-2xs flex items-start gap-1.5", active ? "bg-teal-50 text-teal-600" : "bg-cream-100 text-ink-mute")}>
                              <Flag className="h-3 w-3 mt-0.5 shrink-0" />
                              <span>达标标志：{stage.milestone}</span>
                            </div>
                            {stage.referral && (
                              <div className="mt-1.5 rounded px-3 py-2 text-2xs bg-coral-soft/20 text-coral-dark flex items-start gap-1.5">
                                <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
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
      {records.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3">关联评估记录</h2>
          <div className="divide-y divide-line">
            {records.slice(0, 4).map((r) => (
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
    </div>
  );
}
