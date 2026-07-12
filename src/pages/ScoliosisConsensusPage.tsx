import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ChevronRight,
  Check,
  AlertCircle,
  BookOpen,
  FileText,
  CalendarDays,
  Activity,
  ArrowRight,
  User,
} from "lucide-react";
import { scoliosis, patient } from "@/services";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { EXPERT_CONSENSUS_GUIDELINES, getSeverityByAngle } from "@/data/scoliosis";

export default function ScoliosisConsensusPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [customRecommendations, setCustomRecommendations] = useState<string>("");
  const [expertNote, setExpertNote] = useState<string>("");

  const patients = patient.list(user?.id ?? "");
  const records = useMemo(() => scoliosis.listRecords(selectedPatient || undefined), [selectedPatient]);

  const currentRecord = useMemo(() => {
    if (!selectedRecord) return null;
    return scoliosis.listRecords().find((r) => r.id === selectedRecord);
  }, [selectedRecord]);

  const guidelines = useMemo(() => {
    if (!currentRecord) return null;
    const severity = getSeverityByAngle(currentRecord.primaryCurveAngle);
    return EXPERT_CONSENSUS_GUIDELINES[severity];
  }, [currentRecord]);

  const handleSubmit = () => {
    if (!selectedPatient || !selectedRecord) {
      alert("请选择患者和评估记录");
      return;
    }

    const consensus = scoliosis.createConsensus({
      scoliosisRecordId: selectedRecord,
      patientId: selectedPatient,
      recommendations: guidelines?.recommendations || [],
      bracingRecommendation: guidelines?.bracing || "",
      surgicalIndicator: guidelines?.surgical || false,
      observationFrequency: guidelines?.frequency || "",
      exerciseRecommendation: guidelines?.exercise || "",
      consensusLevel: guidelines?.level || "建议",
      expertNote: expertNote || undefined,
    });

    alert("专家共识已保存");
    navigate("/scoliosis");
  };

  const existingConsensus = useMemo(() => {
    if (!selectedRecord) return null;
    return scoliosis.listConsensuses().find((c) => c.scoliosisRecordId === selectedRecord);
  }, [selectedRecord]);

  return (
    <div className="space-y-6 stagger max-w-5xl mx-auto">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-text">Expert Consensus</p>
          <h1 className="font-display text-[1.8rem] leading-tight text-ink">专家共识与治疗建议</h1>
          <p className="text-sm text-ink-mute mt-1">
            基于国际指南和专家共识，为患者制定个性化的治疗方案和随访计划
          </p>
        </div>
        <button onClick={() => navigate("/scoliosis")} className="btn-ghost">
          返回
        </button>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h2 className="section-title mb-4">选择患者</h2>
          <div className="grid gap-2">
            {patients.length === 0 ? (
              <div className="py-6 text-center text-sm text-ink-faint">
                <User className="h-8 w-8 mx-auto mb-2 opacity-40" />
                暂无患者，请先在患者档案中添加
              </div>
            ) : (
              patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPatient(p.id);
                    setSelectedRecord(null);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded border text-left transition-all",
                    selectedPatient === p.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-line hover:border-teal-400",
                  )}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-500 text-cream-50 text-sm font-medium">
                    {p.name.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-2xs text-ink-mute">{p.age}岁 · {p.sex} · {p.diagnosis}</p>
                  </div>
                  {selectedPatient === p.id && (
                    <Check className="h-4 w-4 text-teal-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="section-title mb-4">选择评估记录</h2>
          <div className="grid gap-2">
            {records.length === 0 ? (
              <div className="py-6 text-center text-sm text-ink-faint">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                {selectedPatient ? "该患者暂无评估记录" : "请先选择患者"}
              </div>
            ) : (
              records.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRecord(r.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded border text-left transition-all",
                    selectedRecord === r.id
                      ? "border-teal-500 bg-teal-50"
                      : "border-line hover:border-teal-400",
                  )}
                >
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded",
                      r.severity === "轻度"
                        ? "bg-teal-50 text-teal-600"
                        : r.severity === "中度"
                        ? "bg-amber-soft/40 text-amber-dark"
                        : "bg-coral-soft/30 text-coral",
                    )}
                  >
                    <span className="stat-num text-sm">{r.primaryCurveAngle}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{r.severity}</p>
                    <p className="text-2xs text-ink-mute">{r.curveType} · {r.primaryCurveLocation}</p>
                  </div>
                  {selectedRecord === r.id && (
                    <Check className="h-4 w-4 text-teal-500" />
                  )}
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      {currentRecord && guidelines && (
        <section className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-lg",
                  currentRecord.severity === "轻度"
                    ? "bg-teal-500 text-cream-50"
                    : currentRecord.severity === "中度"
                    ? "bg-amber-500 text-white"
                    : "bg-coral text-white",
                )}
              >
                <span className="stat-num text-xl">{currentRecord.primaryCurveAngle}°</span>
              </div>
              <div>
                <h2 className="section-title">{currentRecord.patientName} - {currentRecord.severity}</h2>
                <p className="text-sm text-ink-mute">
                  {currentRecord.curveType} · {currentRecord.primaryCurveLocation}
                </p>
              </div>
            </div>
            <span className="chip">
              {guidelines.level}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4 text-teal-500" />
                <h3 className="text-sm font-medium text-ink">核心推荐意见</h3>
              </div>
              <div className="space-y-3">
                {guidelines.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded bg-cream-50">
                    <div className="grid h-5 w-5 place-items-center rounded-full bg-teal-500 text-cream-50 text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-ink">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-amber-dark" />
                <h3 className="text-sm font-medium text-ink">治疗建议</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded bg-amber-soft/20 border border-amber-soft/40">
                  <p className="text-2xs text-ink-mute mb-1">支具治疗</p>
                  <p className="text-sm text-amber-dark font-medium">{guidelines.bracing}</p>
                </div>

                <div className="p-4 rounded bg-teal-50 border border-teal-200">
                  <p className="text-2xs text-ink-mute mb-1">康复训练</p>
                  <p className="text-sm text-teal-700">{guidelines.exercise}</p>
                </div>

                <div className="p-4 rounded border border-line">
                  <p className="text-2xs text-ink-mute mb-1">随访频率</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-ink-faint" />
                    <p className="text-sm text-ink">{guidelines.frequency}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-4 rounded border",
                    guidelines.surgical
                      ? "bg-coral-soft/20 border-coral-soft/40"
                      : "bg-teal-50 border-teal-200",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {guidelines.surgical ? (
                      <AlertCircle className="h-4 w-4 text-coral" />
                    ) : (
                      <Check className="h-4 w-4 text-teal-500" />
                    )}
                    <p className={cn("text-sm font-medium", guidelines.surgical ? "text-coral" : "text-teal-700")}>
                      {guidelines.surgical ? "建议手术评估" : "暂无需手术干预"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-line">
            <h3 className="text-sm font-medium text-ink mb-3">专家备注</h3>
            <textarea
              value={expertNote}
              onChange={(e) => setExpertNote(e.target.value)}
              className="input resize-none h-24"
              placeholder="在此添加额外的专家建议或特殊注意事项..."
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleSubmit} className="btn-primary">
              保存专家共识
            </button>
            <button
              onClick={() => {
                if (selectedRecord) {
                  const plan = scoliosis.generatePlan(selectedRecord, user?.id ?? "");
                  if (plan) {
                    alert("康复计划已生成");
                    navigate(`/plan/${plan.id}`);
                  }
                }
              }}
              className="btn-coral"
            >
              生成康复计划
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {existingConsensus && (
        <section className="card p-5 bg-cream-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Check className="h-4 w-4 text-teal-500" />
            <h3 className="text-sm font-medium text-teal-700">已存在专家共识</h3>
          </div>
          <p className="text-sm text-ink-mute">
            该评估记录已有专家共识，生成时间：{new Date(existingConsensus.createdAt).toLocaleDateString()}
          </p>
        </section>
      )}
    </div>
  );
}