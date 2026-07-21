import { useState } from "react";
import {
  Zap, Hand, ClipboardCheck, Clock, Award, Activity,
  AlertCircle, Search, TrendingUp, MapPin, ZapOff,
} from "lucide-react";
import {
  DRY_NEEDLE, DRY_NEEDLE_CONTRAINDICATIONS, EVIDENCE_LEVELS,
  MANUAL_THERAPIES, ASSESSMENT_STANDARDS, DECISION_TIMINGS,
  MUSCLE_DISEASE_MAP, REF_MODULES, REGION_SUMMARY, QUICK_REF, EVIDENCE_UPDATES,
} from "@/data/quick-reference";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, typeof Zap> = { Zap, Hand, ClipboardCheck, Clock, Award, Activity, TrendingUp, MapPin, ZapOff };

const EVIDENCE_COLOR: Record<string, string> = {
  A: "bg-teal-50 text-teal-600",
  B: "bg-amber-soft/30 text-amber-dark",
  C: "bg-coral-soft/30 text-coral",
};

export default function ReferencePage() {
  const [active, setActive] = useState(REF_MODULES[0].id);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-5">
      <header>
        <p className="label-text">Clinical Reference</p>
        <h1 className="font-display text-[1.7rem] leading-tight text-ink">临床参考工具</h1>
        <p className="text-sm text-ink-mute mt-1">干针疗法、手法技术、评估标准、决策时机与肌肉疾病映射，快速查阅循证依据。</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {REF_MODULES.map((m) => {
          const Icon = ICON_MAP[m.icon] ?? Activity;
          return (
            <button
              key={m.id}
              onClick={() => { setActive(m.id); setSearch(""); }}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm transition-all",
                active === m.id
                  ? "bg-teal-500 text-cream-50 shadow-soft"
                  : "bg-cream-100 text-ink-soft hover:bg-cream-200",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.7} />
              <span className="font-medium">{m.title}</span>
              <span className={cn("text-2xs px-1.5 py-0.5 rounded-full", active === m.id ? "bg-teal-400/40 text-cream-50" : "bg-cream-200 text-ink-mute")}>{m.count}</span>
            </button>
          );
        })}
      </div>

      {active === "muscle-disease" && (
        <div className="relative max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-faint" />
          <input className="input pl-8" placeholder="搜索肌肉名称或疾病" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {active === "dry-needle" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {DRY_NEEDLE.map((d, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-ink">{d.area}</span>
                  <span className="chip text-2xs">证据 {d.evidence}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-2xs text-ink-mute mb-2">
                  <div>疼痛缓解 <span className="text-ink font-medium">{d.painRelief}</span></div>
                  <div>功能改善 <span className="text-ink font-medium">{d.function}</span></div>
                  <div>证据等级 <span className="text-ink font-medium">{d.evidence}</span></div>
                </div>
                <p className="text-2xs text-teal-600">{d.conclusion}</p>
                <p className="text-2xs text-ink-faint mt-1">{d.reference}</p>
              </div>
            ))}
          </div>
          <div className="card p-4 border-coral-soft/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-coral" />
              <h3 className="text-sm font-medium text-coral-dark">绝对/相对禁忌证</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {DRY_NEEDLE_CONTRAINDICATIONS.map((c, i) => (
                <span key={i} className="rounded bg-coral-soft/20 px-2.5 py-1 text-2xs text-coral">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {active === "manual-therapy" && (
        <div className="space-y-3">
          {MANUAL_THERAPIES.map((t, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-medium text-ink">{t.technique}</h3>
                <span className={cn("text-2xs px-2 py-0.5 rounded shrink-0", EVIDENCE_COLOR[t.evidence] || "bg-cream-100 text-ink-mute")}>
                  {t.evidence} 级证据
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-2xs">
                <div><span className="text-ink-mute">适应：</span><span className="text-ink-soft">{t.indication}</span></div>
                <div><span className="text-coral">慎用：</span><span className="text-ink-soft">{t.precaution}</span></div>
                <div><span className="text-ink-mute">来源：</span><span className="text-ink-faint">{t.reference}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "assessment-standard" && (
        <div className="space-y-3">
          {ASSESSMENT_STANDARDS.map((a, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h3 className="text-sm font-medium text-ink">{a.name}</h3>
                <span className="chip text-2xs">{a.range}</span>
              </div>
              <p className="text-2xs text-ink-soft mb-1">{a.interpretation}</p>
              <p className="text-2xs text-teal-600">用途：{a.usage}</p>
            </div>
          ))}
        </div>
      )}

      {active === "decision-timing" && (
        <div className="space-y-3">
          {DECISION_TIMINGS.map((d, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600 text-2xs font-medium">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-ink mb-1">{d.condition}</h3>
                  <p className="text-2xs text-teal-600 font-medium mb-1">{d.timing}</p>
                  <p className="text-2xs text-ink-soft mb-1">{d.rationale}</p>
                  <p className="text-2xs text-ink-faint">{d.reference}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "evidence-level" && (
        <div className="grid md:grid-cols-3 gap-4">
          {EVIDENCE_LEVELS.map((e, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="stat-num text-xl text-ink">{e.level}</p>
              <p className="text-2xs text-ink-mute mt-1">{e.definition}</p>
              <p className="text-2xs text-teal-600 mt-1">{e.ocebm}</p>
              <div className="mt-2 flex items-center justify-center gap-2 text-2xs text-ink-mute">
                <span>{e.count} 项</span>
                <span>·</span>
                <span>{e.ratio}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "evidence-update" && (
        <div className="space-y-3">
          {EVIDENCE_UPDATES.map((u, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-600 text-2xs font-medium">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-ink">{u.muscleGroup}</h3>
                    <span className="chip text-2xs">{u.keyMuscle}</span>
                  </div>
                  <p className="text-2xs text-teal-600 font-medium mb-1">{u.keyUpdate}</p>
                  <p className="text-2xs text-ink-soft mb-1">推荐：{u.recommendation}</p>
                  <p className="text-2xs text-ink-faint">{u.reference}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "region-summary" && (
        <div className="grid md:grid-cols-2 gap-3">
          {REGION_SUMMARY.map((r, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-ink">{r.region}</h3>
                <span className="chip text-2xs">{r.muscleCount} 块肌肉</span>
              </div>
              <div className="space-y-1.5 text-2xs">
                <div><span className="text-ink-mute">主要功能：</span><span className="text-ink-soft">{r.mainFunction}</span></div>
                <div><span className="text-ink-mute">常见损伤：</span><span className="text-ink-soft">{r.commonInjury}</span></div>
                <div><span className="text-coral">红旗征：</span><span className="text-ink-soft">{r.redFlag}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "quick-ref" && (
        <div className="space-y-2">
          {QUICK_REF.map((q, i) => (
            <details key={i} className="card p-4 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink">{q.muscle}</span>
                  <span className="chip text-2xs">{q.region}</span>
                </div>
                <span className="text-2xs text-teal-500 group-open:hidden">展开</span>
                <span className="text-2xs text-teal-500 hidden group-open:inline">收起</span>
              </summary>
              <div className="mt-3 grid md:grid-cols-2 gap-3 text-2xs">
                <div><span className="text-ink-mute">常见损伤：</span><span className="text-ink-soft">{q.commonInjury}</span></div>
                <div><span className="text-ink-mute">关键评估：</span><span className="text-ink-soft">{q.keyAssessment}</span></div>
                <div><span className="text-coral">急救处理：</span><span className="text-ink-soft">{q.emergency}</span></div>
                <div><span className="text-ink-mute">重返标准：</span><span className="text-ink-soft">{q.returnStandard}</span></div>
              </div>
            </details>
          ))}
        </div>
      )}

      {active === "muscle-disease" && (() => {
        const q = search.trim().toLowerCase();
        const filtered = q
          ? MUSCLE_DISEASE_MAP.filter((m) => m.muscle.toLowerCase().includes(q) || m.diseases.toLowerCase().includes(q))
          : MUSCLE_DISEASE_MAP;
        return (
          <div className="space-y-2">
            <p className="text-2xs text-ink-mute">共 {filtered.length} 条匹配</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filtered.map((m, i) => (
                <div key={i} className="card p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-ink truncate">{m.muscle}</span>
                    {m.diseaseCount > 0 && <span className="chip text-2xs">{m.diseaseCount} 种</span>}
                  </div>
                  <p className="text-2xs text-ink-soft line-clamp-2">{m.diseases}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
