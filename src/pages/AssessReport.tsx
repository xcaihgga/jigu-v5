import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, CalendarPlus, Route, TrendingUp, Info } from "lucide-react";
import { assess, pathway } from "@/services";
import { useCountUp } from "@/hooks/useCountUp";
import { fmtDateTime } from "@/lib/storage";
import RadarChart from "@/components/ui/RadarChart";
import GradeBadge from "@/components/ui/GradeBadge";
import CategoryIcon from "@/components/CategoryIcon";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const toneText: Record<"good" | "warn" | "bad", { color: string; bg: string }> = {
  good: { color: "text-teal-600", bg: "bg-teal-50" },
  warn: { color: "text-amber-dark", bg: "bg-amber-soft/30" },
  bad: { color: "text-coral-dark", bg: "bg-coral-soft/30" },
};

export default function AssessReport() {
  const { scaleId, recordId } = useParams();
  const navigate = useNavigate();
  const record = recordId ? assess.getRecord(recordId) : undefined;
  const scale = scaleId ? assess.getScale(scaleId) : undefined;

  const suggestions = useMemo(
    () => (record ? pathway.recommend(record.patientId).slice(0, 2) : []),
    [record],
  );

  const animatedScore = useCountUp(record?.totalScore ?? 0);

  if (!record || !scale) {
    return <EmptyState icon={<FileText className="h-10 w-10" />} title="报告不存在" action={<button onClick={() => navigate("/assess")} className="btn-ghost btn-sm">返回评估中心</button>} />;
  }

  const ratio = record.maxScore ? (record.totalScore / record.maxScore) * 100 : 0;
  const tone = toneText[record.tone];

  const interpretation =
    record.tone === "good"
      ? `该患者本次 ${scale.title} 评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，功能状态良好。建议进入维持性训练并定期复评，关注维度短板以防退步。`
      : record.tone === "warn"
        ? `该患者本次评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，存在中度功能受限。建议基于短板维度生成针对性康复计划，4–6 周后复评。`
        : `该患者本次评估得分为 ${record.totalScore}/${record.maxScore}，分级为「${record.grade}」，功能受损明显。建议立即制定个性化康复计划，必要时结合临床路径与多学科转介。`;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <button onClick={() => navigate("/assess")} className="inline-flex items-center gap-1 text-2xs text-ink-mute hover:text-teal-500">
        <ArrowLeft className="h-3 w-3" /> 评估中心
      </button>

      {/* 报告头 */}
      <div className="card overflow-hidden">
        <div className="flex items-stretch">
          <div className={cn("w-1.5", tone.bg)} />
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon category={record.category} />
                  <span className="font-mono text-2xs uppercase tracking-[0.16em] text-teal-500">{scale.abbr}</span>
                  <GradeBadge grade={record.grade} tone={record.tone} size="sm" />
                </div>
                <h1 className="font-display text-2xl text-ink leading-tight">{scale.title} 评估报告</h1>
                <p className="text-sm text-ink-mute mt-1.5">
                  {record.patientName} · {fmtDateTime(record.takenAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="label-text mb-0">总分</p>
                <p className={cn("stat-num text-4xl leading-none", tone.color)}>
                  {Math.round(animatedScore)}
                  <span className="text-lg text-ink-faint">/{record.maxScore}</span>
                </p>
                <p className="text-2xs text-ink-mute mt-1">{ratio.toFixed(0)}% · {record.grade}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-5">
        {/* 雷达图 */}
        <div className="card p-6">
          <h2 className="section-title mb-1">维度画像</h2>
          <p className="text-2xs text-ink-mute mb-4">各维度得分占该维度满分比例</p>
          <div className="flex justify-center py-2">
            <RadarChart data={record.dimensionScores} size={260} />
          </div>
        </div>

        {/* 维度条 */}
        <div className="card p-6">
          <h2 className="section-title mb-4">维度明细</h2>
          <div className="space-y-4">
            {record.dimensionScores.map((d) => {
              const r = d.max ? (d.score / d.max) * 100 : 0;
              const barColor = r >= 70 ? "bg-teal-500" : r >= 40 ? "bg-amber" : "bg-coral";
              return (
                <div key={d.dimension}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-ink-soft">{d.dimension}</span>
                    <span className="stat-num text-ink-mute">{d.score}<span className="text-2xs text-ink-faint">/{d.max}</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-cream-200 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${r}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 解读 */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">临床解读与建议</h2>
        </div>
        <p className="text-sm text-ink-soft leading-relaxed">{interpretation}</p>
      </div>

      {/* 推荐路径 */}
      {suggestions.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Route className="h-4 w-4 text-coral" />
            <h2 className="section-title">推荐临床路径</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {suggestions.map((s) => (
              <button
                key={s.pathway.id}
                onClick={() => navigate("/pathway")}
                className="text-left rounded border border-line p-4 hover:border-teal-400 hover:shadow-soft transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-ink text-sm">{s.pathway.title}</span>
                  <span className="stat-num text-xs text-coral">{s.fit}%</span>
                </div>
                <p className="text-2xs text-ink-mute line-clamp-2">{s.reason}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 行动按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/plan?from=${record.id}`)}
          className="btn-coral"
        >
          <CalendarPlus className="h-4 w-4" /> 基于本次评估生成康复计划
        </button>
        <button onClick={() => navigate("/pathway")} className="btn-ghost">
          <Route className="h-4 w-4" /> 查看临床路径
        </button>
        <button onClick={() => navigate("/progress")} className="btn-ghost">
          <TrendingUp className="h-4 w-4" /> 查看进度追踪
        </button>
      </div>
    </div>
  );
}
