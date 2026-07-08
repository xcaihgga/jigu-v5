import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Users, ClipboardCheck, Loader2 } from "lucide-react";
import { assess, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
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

  const patients = useMemo(() => patient.list(user?.id), [user?.id]);

  if (!scale) {
    return <EmptyState icon={<ClipboardCheck className="h-10 w-10" />} title="量表不存在" desc="可能链接已失效" action={<button onClick={() => navigate("/assess")} className="btn-ghost btn-sm">返回评估中心</button>} />;
  }

  const q = scale.questions[idx];
  const total = scale.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / total) * 100;

  const choose = (qid: string, score: number) => {
    setAnswers((a) => ({ ...a, [qid]: score }));
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
          {scale.questions.map((qq, i) => (
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
    </div>
  );
}
