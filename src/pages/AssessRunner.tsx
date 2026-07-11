import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Users, ClipboardCheck, Loader2, ClipboardPaste, Wand2, History } from "lucide-react";
import { assess, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
import { parseAssessment } from "@/lib/text-parser";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import type { Patient } from "@/lib/types";

export default function AssessRunner() {
  const { scaleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const scale = scaleId ? assess.getScale(scaleId) : undefined;

  const [pickOpen, setPickOpen] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickText, setQuickText] = useState("");

  const patients = useMemo(() => patient.list(user?.id), [user?.id]);

  if (!scale) {
    return <EmptyState icon={<ClipboardCheck className="h-10 w-10" />} title="量表不存在" desc="可能链接已失效" action={<button onClick={() => navigate("/assess")} className="btn-ghost btn-sm">返回评估中心</button>} />;
  }

  // 条件跳转：过滤出满足条件的题目
  const visibleQuestions = useMemo(() => {
    return scale.questions.filter((question) => {
      if (!question.condition) return true;
      const condScore = answers[question.condition.questionId];
      if (condScore === undefined) return false;
      if (question.condition.min !== undefined && condScore < question.condition.min) return false;
      if (question.condition.max !== undefined && condScore > question.condition.max) return false;
      return true;
    });
  }, [scale.questions, answers]);

  const q = visibleQuestions[idx] ?? scale.questions[idx];
  const total = visibleQuestions.length;
  const answeredCount = visibleQuestions.filter((qq) => answers[qq.id] !== undefined).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  const choose = (qid: string, score: number) => {
    setAnswers((a) => ({ ...a, [qid]: score }));
  };

  // 智能粘贴：基于 scale 上下文推断每题得分
  const handleQuickApply = () => {
    if (!quickText.trim()) { toast.error("请先粘贴文字"); return; }
    const parsed = parseAssessment(quickText, scale.id);
    const newAnswers: Record<string, number> = { ...answers };
    const filled: string[] = [];
    // 1) VAS 优先：选择包含 vas 关键词的题（用首题作 fallback）
    if (typeof parsed.vas === "number") {
      const vasQ = scale.questions.find((qq) => /vas|疼痛|pain/i.test(qq.text + qq.dimension));
      const target = vasQ || scale.questions[0];
      if (target) { newAnswers[target.id] = parsed.vas; filled.push(`${target.text} = ${parsed.vas}`); }
    }
    // 2) Barthel / Berg / Tinetti / FIM 量表题：用首题
    const singleScale = ["barthel", "berg", "tinetti", "fim", "mmt"].find((k) => parsed[k] !== undefined) as keyof typeof parsed | undefined;
    if (singleScale) {
      const value = parsed[singleScale];
      const firstQ = scale.questions[0];
      if (firstQ && typeof value === "number") { newAnswers[firstQ.id] = value; filled.push(`${firstQ.text} = ${value}`); }
    }
    // 3) Ashworth / MAS：优先肌张力相关题
    if (parsed.ashworth || parsed.mas) {
      const ashQ = scale.questions.find((qq) => /肌张力|痉挛|ashworth|spasm/i.test(qq.text + qq.dimension));
      if (ashQ) {
        const v = parseInt(String(parsed.ashworth ?? parsed.mas).replace("+", ""), 10);
        if (!isNaN(v)) { newAnswers[ashQ.id] = v; filled.push(`${ashQ.text} = ${v}`); }
      }
    }
    // 4) 6MWD 步行距离：寻找 6 分钟相关题
    if (typeof parsed.walk6min === "number") {
      const wq = scale.questions.find((qq) => /6.*分钟|6MW|步行距离/i.test(qq.text + qq.dimension));
      if (wq) { newAnswers[wq.id] = parsed.walk6min; filled.push(`${wq.text} = ${parsed.walk6min}`); }
    }
    // 5) ROM 角度：模糊匹配关节+运动
    if (Array.isArray(parsed.rom)) {
      for (const r of parsed.rom) {
        const mq = scale.questions.find((qq) => qq.text.includes(r.joint) && qq.text.includes(r.movement));
        if (mq) { newAnswers[mq.id] = r.angle; filled.push(`${mq.text} = ${r.angle}°`); }
      }
    }
    // 6) 肌力：按"肌力"题填入
    if (Array.isArray(parsed.strength)) {
      for (const s of parsed.strength) {
        const mq = scale.questions.find((qq) => /肌力|strength|MMT/i.test(qq.text + qq.dimension));
        if (mq) { newAnswers[mq.id] = s.level; filled.push(`${mq.text} = ${s.level}`); }
      }
    }
    setAnswers(newAnswers);
    setQuickOpen(false);
    setQuickText("");
    if (filled.length) {
      toast.success(`已自动填入 ${filled.length} 项：${filled.slice(0, 2).join("；")}${filled.length > 2 ? "…" : ""}`);
    } else {
      toast.error("未识别到匹配的题项，请检查量表类型或粘贴格式");
    }
  };

  const submit = () => {
    if (!selectedPatient || !user) return;
    setSubmitting(true);
    setTimeout(() => {
      try {
        const rec = assess.submit(scale.id, selectedPatient.id, user.id, answers);
        toast.success("评估完成，已生成报告");
        navigate(`/assess/${scale.id}/report/${rec.id}`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "提交失败");
      } finally {
        setSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 顶部信息 */}
      <button onClick={() => navigate("/assess")} className="inline-flex items-center gap-1 text-2xs text-ink-mute hover:text-teal-500 mb-3">
        <ArrowLeft className="h-3 w-3" /> 评估中心
      </button>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-teal-500">{scale.abbr}</p>
          <h1 className="font-display text-2xl text-ink">{scale.title}</h1>
        </div>
        {selectedPatient && (
          <button onClick={() => setPickOpen(true)} className="chip hover:border-teal-400">
            <Users className="h-3 w-3" /> {selectedPatient.name} · {selectedPatient.diagnosis}
          </button>
        )}
      </div>
      <p className="text-sm text-ink-mute mb-5">{scale.subtitle} · 适用 {scale.scenario}</p>

      <div className="flex items-center justify-end gap-2 mb-3">
        <button onClick={() => setQuickOpen(true)} className="btn-ghost btn-sm text-2xs">
          <ClipboardPaste className="h-3.5 w-3.5" /> 快速记录
        </button>
        <button onClick={() => setIdx(0)} className="btn-ghost btn-sm text-2xs">
          <History className="h-3.5 w-3.5" /> 重置进度
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-2xs text-ink-mute mb-1.5">
          <span>第 {idx + 1} / {total} 题</span>
          <span className="stat-num">{Math.round(progress)}% 已作答</span>
        </div>
        <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
          <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 题目卡 */}
      <div key={q.id} className="card p-7 animate-fade-up">
        <div className="flex items-center gap-2 mb-4">
          <span className="chip text-2xs">{q.dimension}</span>
          <span className="text-2xs text-ink-faint">题 {idx + 1}</span>
        </div>
        <p className="font-display text-xl text-ink leading-snug mb-6 text-balance">{q.text}</p>
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === opt.score;
            return (
              <button
                key={i}
                onClick={() => choose(q.id, opt.score)}
                className={cn(
                  "w-full flex items-center gap-3 rounded border px-4 py-3 text-left transition-all",
                  selected ? "border-teal-500 bg-teal-50 shadow-soft" : "border-line bg-surface hover:border-teal-300 hover:bg-cream-50",
                )}
              >
                <span className={cn("grid h-6 w-6 place-items-center rounded-full border text-2xs font-medium shrink-0", selected ? "border-teal-500 bg-teal-500 text-cream-50" : "border-line text-ink-mute")}>
                  {selected ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                </span>
                <span className={cn("text-sm flex-1", selected ? "text-ink font-medium" : "text-ink-soft")}>{opt.label}</span>
                <span className="stat-num text-2xs text-ink-faint">{opt.score} 分</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 导航 */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" /> 上一题
        </button>
        <div className="flex items-center gap-1">
          {visibleQuestions.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => setIdx(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === idx ? "w-5 bg-coral" : answers[qq.id] !== undefined ? "w-1.5 bg-teal-500" : "w-1.5 bg-cream-300",
              )}
              title={`第 ${i + 1} 题`}
            />
          ))}
        </div>
        {idx < total - 1 ? (
          <button onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="btn-primary">
            下一题 <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={answeredCount < total || submitting || !selectedPatient}
            className="btn-coral disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            提交并生成报告
          </button>
        )}
      </div>
      {answeredCount < total && idx === total - 1 && (
        <p className="text-2xs text-amber-dark text-center mt-3">还有 {total - answeredCount} 题未作答</p>
      )}

      {/* 患者选择 */}
      <Modal open={pickOpen} onClose={() => { if (selectedPatient) setPickOpen(false); }} title="选择评估对象" size="md">
        {selectedPatient && (
          <button onClick={() => setPickOpen(false)} className="absolute top-3.5 right-12 text-ink-faint hover:text-ink-mute">
            <X className="h-4 w-4" />
          </button>
        )}
        <p className="text-sm text-ink-mute mb-4">为本次评估选择患者，评估结果将归入该患者档案。</p>
        {patients.length === 0 ? (
          <EmptyState icon={<Users className="h-10 w-10" />} title="暂无患者" desc="请先在患者档案中新建" action={<button onClick={() => navigate("/patients")} className="btn-primary btn-sm">去新建</button>} />
        ) : (
          <div className="space-y-2 max-h-[50vh] overflow-y-auto">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedPatient(p); setPickOpen(false); }}
                className={cn("w-full flex items-center gap-3 rounded border px-3.5 py-3 text-left transition-all", selectedPatient?.id === p.id ? "border-teal-500 bg-teal-50" : "border-line hover:border-teal-300")}
              >
                <div className="grid h-9 w-9 place-items-center rounded-full bg-teal-500 text-cream-50 text-xs font-medium shrink-0">{p.name.slice(0, 1)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{p.name} <span className="text-2xs text-ink-mute font-normal">{p.age}岁 · {p.sex}</span></p>
                  <p className="text-2xs text-ink-mute truncate">{p.diagnosis}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* 快速记录（智能粘贴） */}
      <Modal
        open={quickOpen}
        onClose={() => setQuickOpen(false)}
        title="快速记录（智能粘贴）"
        size="lg"
        footer={
          <>
            <button onClick={() => setQuickText("")} className="btn-ghost btn-sm">清空</button>
            <button onClick={() => setQuickOpen(false)} className="btn-ghost btn-sm">取消</button>
            <button onClick={handleQuickApply} disabled={!quickText.trim()} className="btn-primary btn-sm disabled:opacity-50">
              <Wand2 className="h-3.5 w-3.5" /> 解析并填入
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-mute mb-2">
          粘贴医嘱/查体文字，系统将自动识别 VAS、ROM、肌力、肌张力、Berg、Barthel 等数值并填入对应题目。
        </p>
        <textarea
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          placeholder="示例：&#10;VAS 评分：5/10&#10;左肩前屈 120°，后伸 30°，外展 90°&#10;左肱二头肌肌力 4 级&#10;Ashworth 1+&#10;Berg 评分 42&#10;Barthel 指数 65"
          className="input min-h-[200px] font-mono text-2xs leading-relaxed"
        />
        <p className="text-2xs text-ink-faint mt-2">识别后仅覆盖匹配字段，可手动调整。</p>
      </Modal>
    </div>
  );
}
