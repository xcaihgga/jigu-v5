import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Users, ArrowRight, Check, Flag, ChevronRight, Sparkles, AlertTriangle, Map, BookOpen, Layers, Zap, ClipboardPaste, Wand2, Brain, Heart, Activity, Pill, Stethoscope } from "lucide-react";
import { pathway, patient, assess } from "@/services";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { parseCase } from "@/lib/text-parser";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import CategoryIcon from "@/components/CategoryIcon";
import type { Patient } from "@/lib/types";
import { MUSCLE_DISEASE_MAP, REGION_SUMMARY, QUICK_REF } from "@/data/quick-reference";
import { RED_FLAGS } from "@/data/red-flags";
import { EVIDENCE_UPDATES } from "@/data/quick-reference";

export default function PathwayPage() {
  const navigate = useNavigate();
  const patients = patient.list();
  const [patientId, setPatientId] = useState(patients[0]?.id ?? "");
  const current = patients.find((p) => p.id === patientId);

  const suggestions = useMemo(() => (patientId ? pathway.recommend(patientId) : []), [patientId]);
  const states = useMemo(() => (patientId ? pathway.statesByPatient(patientId) : []), [patientId]);
  const records = useMemo(() => (patientId ? assess.listRecords(patientId) : []), [patientId]);

  const [caseOpen, setCaseOpen] = useState(false);
  const [caseText, setCaseText] = useState("");
  const [caseResult, setCaseResult] = useState<{ tags: string[]; suggestions: string[] } | null>(null);

  const handleCaseParse = () => {
    if (!caseText.trim()) { toast.error("请粘贴病例描述"); return; }
    const r = parseCase(caseText);
    setCaseResult(r);
  };

  const handleImport = (selected: string) => {
    if (!patientId) { toast.error("请先选择患者"); return; }
    const pw = pathway.list().find((p) => p.title === selected);
    if (pw) {
      pathway.start(patientId, pw.id);
      toast.success(`已为「${current?.name ?? "该患者"}」启用「${pw.title}」`);
      setCaseOpen(false);
    } else {
      toast.error("未找到匹配的路径定义");
    }
  };

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
          <button onClick={() => setCaseOpen(true)} className="btn-ghost btn-sm">
            <ClipboardPaste className="h-3.5 w-3.5" /> 病例导入
          </button>
        </div>
      </header>

      {/* 病例导入 Modal */}
      <Modal
        open={caseOpen}
        onClose={() => setCaseOpen(false)}
        title="病例导入 · 智能推荐路径"
        size="lg"
        footer={
          <>
            <button onClick={() => { setCaseText(""); setCaseResult(null); }} className="btn-ghost btn-sm">清空</button>
            <button onClick={() => setCaseOpen(false)} className="btn-ghost btn-sm">关闭</button>
            <button onClick={handleCaseParse} disabled={!caseText.trim()} className="btn-primary btn-sm disabled:opacity-50">
              <Wand2 className="h-3.5 w-3.5" /> 解析病例
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-mute mb-2">粘贴一段病例描述（含诊断、症状、合并症等），系统将自动识别关键词并推荐合适的临床路径。</p>
        <textarea
          value={caseText}
          onChange={(e) => setCaseText(e.target.value)}
          placeholder="示例：&#10;患者男性，62 岁，因突发右侧肢体无力 5 天入院&#10;诊断：急性脑梗死（左侧大脑中动脉）&#10;现右上肢 Brunnstrom Ⅱ，下肢 Brunnstrom Ⅲ&#10;合并高血压、2 型糖尿病"
          className="input min-h-[180px] font-mono text-2xs leading-relaxed"
        />
        {caseResult && (
          <div className="mt-4 space-y-3">
            <div>
              <p className="label-text mb-1.5">识别标签</p>
              {caseResult.tags.length === 0 ? <p className="text-2xs text-ink-faint">未识别到匹配标签</p> : (
                <div className="flex flex-wrap gap-1.5">
                  {caseResult.tags.map((t) => <span key={t} className="chip chip-active text-2xs">{t}</span>)}
                </div>
              )}
            </div>
            <div>
              <p className="label-text mb-1.5">推荐路径</p>
              {caseResult.suggestions.length === 0 ? <p className="text-2xs text-ink-faint">未匹配到已知路径</p> : (
                <div className="space-y-2">
                  {caseResult.suggestions.map((s) => (
                    <div key={s} className="flex items-center justify-between gap-2 rounded border border-line p-2.5">
                      <span className="text-sm text-ink">{s}</span>
                      <button onClick={() => handleImport(s)} className="btn-primary btn-sm text-2xs">
                        <Route className="h-3 w-3" /> 启用
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

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

      {/* 红旗征警示系统 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-coral" />
          <h2 className="section-title">红旗征警示系统</h2>
          <span className="text-2xs text-ink-mute">需立即识别与转介的危险信号</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {RED_FLAGS.map((rf, idx) => (
            <div key={idx} className="rounded border border-coral-soft/40 bg-coral-soft/10 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-coral-dark">{rf.system}</span>
                <span className="chip text-2xs bg-coral-soft/20 text-coral-dark">出现 {rf.frequency} 次</span>
              </div>
              <p className="text-2xs text-ink mt-1">{rf.flag}</p>
              <p className="text-2xs text-ink-mute mt-1">相关肌肉：{rf.muscles}</p>
              <div className="mt-2 rounded bg-cream-100 px-2 py-1 text-2xs text-ink-soft">
                处置：{rf.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 肌肉-疾病关联 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Map className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">肌肉疾病映射</h2>
          <span className="text-2xs text-ink-mute">肌肉与常见疾病的关联速查</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead>
              <tr className="border-b border-line text-left text-ink-mute">
                <th className="py-2 pr-3 font-medium">肌肉</th>
                <th className="py-2 pr-3 font-medium">疾病数量</th>
                <th className="py-2 pr-3 font-medium">相关疾病</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {MUSCLE_DISEASE_MAP.filter((m) => m.diseaseCount > 0).map((m, i) => (
                <tr key={i} className="hover:bg-cream-50/60">
                  <td className="py-2 pr-3 text-ink font-medium">{m.muscle}</td>
                  <td className="py-2 pr-3 text-teal-600">{m.diseaseCount}</td>
                  <td className="py-2 pr-3 text-ink-mute">{m.diseases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 身体区域速查 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">身体区域速查</h2>
          <span className="text-2xs text-ink-mute">按区域快速定位肌肉与常见损伤</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REGION_SUMMARY.map((r, idx) => (
            <div key={idx} className="rounded border border-line bg-surface p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-ink">{r.region}</span>
                <span className="chip text-2xs">{r.muscleCount} 块肌肉</span>
              </div>
              <p className="text-2xs text-ink-mute mt-1">主要功能：{r.mainFunction}</p>
              <p className="text-2xs text-ink-mute mt-1">常见损伤：{r.commonInjury}</p>
              <div className="mt-2 rounded bg-coral-soft/10 px-2 py-1 text-2xs text-coral-dark">
                红旗征：{r.redFlag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 肌肉快速参考 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">肌肉快速参考</h2>
          <span className="text-2xs text-ink-mute">关键评估、紧急处理与重返标准</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead>
              <tr className="border-b border-line text-left text-ink-mute">
                <th className="py-2 pr-3 font-medium">肌肉</th>
                <th className="py-2 pr-3 font-medium">区域</th>
                <th className="py-2 pr-3 font-medium">常见损伤</th>
                <th className="py-2 pr-3 font-medium">关键评估</th>
                <th className="py-2 pr-3 font-medium">紧急处理</th>
                <th className="py-2 pr-3 font-medium">重返标准</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {QUICK_REF.map((q, i) => (
                <tr key={i} className="hover:bg-cream-50/60">
                  <td className="py-2 pr-3 text-ink font-medium">{q.muscle}</td>
                  <td className="py-2 pr-3 text-ink-mute">{q.region}</td>
                  <td className="py-2 pr-3 text-ink-mute">{q.commonInjury}</td>
                  <td className="py-2 pr-3 text-teal-600">{q.keyAssessment}</td>
                  <td className="py-2 pr-3 text-ink-mute">{q.emergency}</td>
                  <td className="py-2 pr-3 text-ink-mute">{q.returnStandard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 循证更新提示 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-4 w-4 text-amber-dark" />
          <h2 className="section-title">重点肌肉循证更新</h2>
          <span className="text-2xs text-ink-mute">最新指南与研究要点</span>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {EVIDENCE_UPDATES.map((ev, idx) => (
            <div key={idx} className="rounded border border-line bg-surface p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-ink">{ev.muscleGroup}</span>
                <span className="chip text-2xs">{ev.keyMuscle}</span>
              </div>
              <p className="text-2xs text-teal-600 mt-1">{ev.keyUpdate}</p>
              <div className="mt-2 rounded bg-teal-50 px-2 py-1 text-2xs text-teal-600">
                推荐：{ev.recommendation}
              </div>
              <p className="text-2xs text-ink-faint mt-1.5">{ev.reference}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 神经康复数据 */}
      <section className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">神经康复数据</h2>
          <span className="text-2xs text-ink-mute">SOAP评估框架、SCI分级、痉挛管理与卒中路径</span>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><ClipboardPaste className="h-3.5 w-3.5 text-teal-500" /> SOAP评估框架</h3>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">Subjective 主观</p>
              <p className="text-sm text-ink">患者主诉、疼痛、功能受限、病史</p>
            </div>
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">Objective 客观</p>
              <p className="text-sm text-ink">体征、测量数据、评估量表得分、影像学结果</p>
            </div>
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">Assessment 评估</p>
              <p className="text-sm text-ink">综合分析、诊断判断、功能分级、预后判断</p>
            </div>
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">Plan 计划</p>
              <p className="text-sm text-ink">治疗目标、干预方案、训练计划、随访安排</p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-coral" /> SCI损伤分级康复目标</h3>
          <div className="grid md:grid-cols-5 gap-3">
            {["C1-C3", "C4-C5", "C6-C7", "T1-T12", "L1-L5"].map((level, idx) => (
              <div key={level} className="rounded border border-line bg-surface p-3">
                <p className="text-2xs text-teal-600 font-medium mb-1">{level}</p>
                <p className="text-2xs text-ink-mute">
                  {idx === 0 && "完全依赖，呼吸支持，电动轮椅"}
                  {idx === 1 && "辅助呼吸，电动轮椅，辅助转移"}
                  {idx === 2 && "手动轮椅，独立转移，部分自理"}
                  {idx === 3 && "步行训练，独立转移，完全自理"}
                  {idx === 4 && "独立步行，上下楼梯，重返社区"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><Pill className="h-3.5 w-3.5 text-amber-dark" /> 痉挛管理方案</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">物理治疗</p>
              <p className="text-sm text-ink">牵伸训练、冷热疗法、振动刺激、功能性活动</p>
            </div>
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">药物治疗</p>
              <p className="text-sm text-ink">巴氯芬、替扎尼定、丹曲林、肉毒毒素注射</p>
            </div>
            <div className="rounded border border-line bg-surface p-3">
              <p className="text-2xs text-ink-mute mb-1">手术治疗</p>
              <p className="text-sm text-ink">肌腱延长、神经切断、选择性脊神经后根切断</p>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><Heart className="h-3.5 w-3.5 text-coral" /> 脑卒中关键路径</h3>
          <div className="grid md:grid-cols-4 gap-3">
            {["急性期(1-2周)", "恢复期(2-8周)", "恢复期(2-6月)", "后遗症期(>6月)"].map((phase, idx) => (
              <div key={phase} className="rounded border border-line bg-surface p-3">
                <p className="text-2xs text-coral font-medium mb-1">{phase}</p>
                <p className="text-2xs text-ink-mute">
                  {idx === 0 && "生命体征稳定，良肢位摆放，早期被动活动"}
                  {idx === 1 && "主动训练，平衡训练，ADL训练，言语治疗"}
                  {idx === 2 && "步态训练，精细运动，认知康复，心理支持"}
                  {idx === 3 && "维持性训练，辅助器具，社区适应，家庭指导"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-ink mb-3 flex items-center gap-2"><Stethoscope className="h-3.5 w-3.5 text-teal-500" /> Brunnstrom偏瘫恢复分期</h3>
          <div className="grid md:grid-cols-6 gap-3">
            {["Ⅰ期", "Ⅱ期", "Ⅲ期", "Ⅳ期", "Ⅴ期", "Ⅵ期"].map((stage, idx) => (
              <div key={stage} className="rounded border border-line bg-surface p-3">
                <p className="text-2xs text-teal-600 font-medium mb-1">{stage}</p>
                <p className="text-2xs text-ink-mute">
                  {idx === 0 && "无随意运动"}
                  {idx === 1 && "出现联合反应"}
                  {idx === 2 && "共同运动达到高峰"}
                  {idx === 3 && "出现分离运动"}
                  {idx === 4 && "分离运动增强"}
                  {idx === 5 && "接近正常"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
