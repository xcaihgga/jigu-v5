import { useState } from "react";
import { Brain, Activity, Stethoscope, Sparkles, Layers, ClipboardList } from "lucide-react";
import { SOAP_FRAMEWORK, SCI_LEVELS, SPASM_MANAGEMENT, STROKE_CRITICAL_PATHWAY, PD_PATHWAY, BRUNNSTROM_STAGES } from "@/data/neuro-extras";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "soap", label: "SOAP 评估框架", icon: ClipboardList, count: SOAP_FRAMEWORK.length, color: "text-teal-500" },
  { id: "sci", label: "SCI 平面康复目标", icon: Layers, count: SCI_LEVELS.length, color: "text-coral" },
  { id: "spasm", label: "痉挛与肌张力管理", icon: Activity, count: SPASM_MANAGEMENT.length, color: "text-amber-dark" },
  { id: "stroke", label: "脑卒中重症康复", icon: Brain, count: STROKE_CRITICAL_PATHWAY.length, color: "text-coral" },
  { id: "pd", label: "PD 全周期路径", icon: Stethoscope, count: PD_PATHWAY.length, color: "text-teal-500" },
  { id: "brunnstrom", label: "Brunnstrom 分期", icon: Sparkles, count: BRUNNSTROM_STAGES.length, color: "text-amber-dark" },
];

export default function NeuroExtrasPage() {
  const [tab, setTab] = useState("soap");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-teal-100 to-transparent rounded-bl-full opacity-60" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-ink-main">神经康复扩展数据</h1>
          </div>
          <p className="text-sm text-ink-soft leading-relaxed max-w-3xl">
            来自《神经系统康复数据库_2.1.xlsx》19 个工作表的核心数据，
            包含 <span className="text-coral font-semibold">SOAP 评估框架 / SCI 平面康复目标 / 痉挛管理 / 脑卒中重症 / PD 全周期 / Brunnstrom 分期</span> 六大模块。
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-teal-50 text-teal-700 border border-teal-200">6 大模块</span>
            <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">深度融入神经康复</span>
            <span className="px-2 py-1 rounded bg-coral-50 text-coral border border-coral-200">数据源：神经系统康复数据库_2.1.xlsx</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card !p-2">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition",
                tab === t.id
                  ? "bg-teal-500 text-cream-50 shadow-soft"
                  : "text-ink-soft hover:bg-cream-200"
              )}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded", tab === t.id ? "bg-cream-50/20" : "bg-cream-200")}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SOAP */}
      {tab === "soap" && (
        <div className="space-y-3">
          {SOAP_FRAMEWORK.map((s) => (
            <div key={s.module} className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-7 w-7 rounded-lg bg-coral text-white grid place-items-center font-bold text-sm">
                  {s.module.charAt(0)}
                </span>
                <h3 className="font-semibold text-ink-main text-lg">{s.module}</h3>
              </div>
              <div className="space-y-2.5 text-sm">
                <div>
                  <p className="text-2xs uppercase tracking-wider text-ink-mute mb-1">核心内容</p>
                  <p className="text-ink-soft leading-relaxed">{s.content}</p>
                </div>
                <div>
                  <p className="text-2xs uppercase tracking-wider text-ink-mute mb-1">神经康复示例</p>
                  <p className="text-ink-soft leading-relaxed bg-cream-200 p-2 rounded border border-line">
                    {s.neuroExample}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-2xs uppercase tracking-wider text-ink-mute mb-1">注意事项</p>
                    <p className="text-ink-soft leading-relaxed text-xs">{s.notes}</p>
                  </div>
                  <div>
                    <p className="text-2xs uppercase tracking-wider text-ink-mute mb-1">ICF 关联</p>
                    <p className="text-ink-soft leading-relaxed text-xs">{s.icfLink}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCI */}
      {tab === "sci" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-200 text-ink-main text-xs">
              <tr>
                <th className="px-3 py-2 text-left">损伤平面</th>
                <th className="px-3 py-2 text-left">ASIA 关键肌</th>
                <th className="px-3 py-2 text-left">基本康复目标</th>
                <th className="px-3 py-2 text-left">生活自理</th>
                <th className="px-3 py-2 text-left">步行功能</th>
                <th className="px-3 py-2 text-left">建议支具/辅具</th>
              </tr>
            </thead>
            <tbody>
              {SCI_LEVELS.map((s, i) => (
                <tr key={s.level} className={cn("border-t border-line", i % 2 === 0 ? "bg-cream-100" : "")}>
                  <td className="px-3 py-2 font-bold text-coral">{s.level}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{s.keyMuscle}</td>
                  <td className="px-3 py-2 text-ink-soft">{s.basicGoal}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{s.selfCare}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{s.walking}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{s.orthosis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Spasm */}
      {tab === "spasm" && (
        <div className="space-y-3">
          {SPASM_MANAGEMENT.map((s) => (
            <div key={s.disease} className="card">
              <h3 className="font-semibold text-ink-main mb-3 text-lg">{s.disease}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-ink-mute mb-1">痉挛特点</p>
                  <p className="text-ink-soft">{s.pattern}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">评估工具</p>
                  <p className="text-ink-soft">{s.assessment}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">口服药物</p>
                  <p className="text-ink-soft">{s.oralDrug}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">注射/局部</p>
                  <p className="text-ink-soft">{s.injection}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">物理治疗</p>
                  <p className="text-ink-soft">{s.pt}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">矫形器</p>
                  <p className="text-ink-soft">{s.orthosis}</p>
                </div>
                <div>
                  <p className="text-ink-mute mb-1">手术/介入</p>
                  <p className="text-ink-soft">{s.surgery}</p>
                </div>
                <div className="md:col-span-2 lg:col-span-2">
                  <p className="text-ink-mute mb-1">注意事项</p>
                  <p className="text-ink-soft bg-amber-50 border border-amber-200 p-2 rounded">{s.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stroke */}
      {tab === "stroke" && (
        <div className="space-y-3">
          {STROKE_CRITICAL_PATHWAY.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-ink-main">{s.stage}</h3>
                <span className="text-xs px-2 py-1 rounded bg-coral text-white">{s.time}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-ink-mute text-xs">目标：</span>
                  <span className="text-ink-soft">{s.goal}</span>
                </div>
                {s.measures && (
                  <div>
                    <span className="text-ink-mute text-xs">措施：</span>
                    <span className="text-ink-soft">{s.measures}</span>
                  </div>
                )}
                {s.criteria && (
                  <div>
                    <span className="text-ink-mute text-xs">达标：</span>
                    <span className="text-ink-soft">{s.criteria}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PD */}
      {tab === "pd" && (
        <div className="space-y-3">
          {PD_PATHWAY.map((p, i) => (
            <div key={i} className="card">
              <h3 className="font-semibold text-ink-main mb-2">{p.stage}</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-ink-mute text-xs mb-1">H-Y 分级</p>
                  <p className="text-ink-soft">{p.hY}</p>
                </div>
                <div>
                  <p className="text-ink-mute text-xs mb-1">主要症状</p>
                  <p className="text-ink-soft">{p.symptoms}</p>
                </div>
                <div>
                  <p className="text-ink-mute text-xs mb-1">康复方案</p>
                  <p className="text-ink-soft">{p.rehab}</p>
                </div>
                <div>
                  <p className="text-ink-mute text-xs mb-1">药物</p>
                  <p className="text-ink-soft">{p.drug}</p>
                </div>
                {p.notes && (
                  <div className="md:col-span-2">
                    <p className="text-ink-mute text-xs mb-1">注意</p>
                    <p className="text-ink-soft">{p.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Brunnstrom */}
      {tab === "brunnstrom" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-200 text-ink-main text-xs">
              <tr>
                <th className="px-3 py-2 text-left">分期</th>
                <th className="px-3 py-2 text-left">特征</th>
                <th className="px-3 py-2 text-left">上肢</th>
                <th className="px-3 py-2 text-left">手</th>
                <th className="px-3 py-2 text-left">下肢</th>
                <th className="px-3 py-2 text-left">干预</th>
              </tr>
            </thead>
            <tbody>
              {BRUNNSTROM_STAGES.map((b, i) => (
                <tr key={b.stage} className={cn("border-t border-line", i % 2 === 0 ? "bg-cream-100" : "")}>
                  <td className="px-3 py-2 font-bold text-coral">{b.stage}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{b.feature}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{b.upperLimb}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{b.hand}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{b.lowerLimb}</td>
                  <td className="px-3 py-2 text-ink-soft text-xs">{b.intervention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
