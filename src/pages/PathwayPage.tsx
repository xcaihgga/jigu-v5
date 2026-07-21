import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Search, ChevronRight, AlertTriangle, Map, Layers, Zap, Brain,
  Heart, Activity, Pill, Stethoscope, ClipboardList, Target, Shield,
  TrendingUp, FileText, Lightbulb, ChevronDown, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MUSCLE_DISEASE_MAP, REGION_SUMMARY, QUICK_REF, EVIDENCE_UPDATES } from "@/data/quick-reference";
import { RED_FLAGS } from "@/data/red-flags";
import { SOAP_FRAMEWORK, SCI_LEVELS, BRUNNSTROM_STAGES, SPASM_MANAGEMENT, STROKE_CRITICAL_PATHWAY, PD_PATHWAY } from "@/data/neuro-extras";
import { REHAB_STAGES, RETURN_STANDARDS } from "@/data/rehab-pathways";
import { PAIN_CONDITIONS, PAIN_CATEGORIES } from "@/data/pain-treatments";

const REFERENCE_SECTIONS = [
  { id: "assessment", label: "评估规范", icon: ClipboardList },
  { id: "neuro", label: "神经康复", icon: Brain },
  { id: "ortho", label: "骨科康复", icon: Activity },
  { id: "pain", label: "疼痛治疗", icon: Target },
  { id: "redflags", label: "红旗征", icon: AlertTriangle },
  { id: "muscle", label: "肌肉参考", icon: Map },
  { id: "stages", label: "康复分期", icon: TrendingUp },
  { id: "evidence", label: "循证更新", icon: Zap },
];

export default function PathwayPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("assessment");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPainConditions = useMemo(() => {
    if (!searchKeyword) return PAIN_CONDITIONS;
    const kw = searchKeyword.toLowerCase();
    return PAIN_CONDITIONS.filter(
      (c) => c.name.toLowerCase().includes(kw) || c.region.toLowerCase().includes(kw) || c.treatment.some((t) => t.toLowerCase().includes(kw))
    );
  }, [searchKeyword]);

  return (
    <div className="space-y-5">
      {/* 页面头部 */}
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost btn-sm" title="返回">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="label-text">Clinical Reference</p>
            <h1 className="font-display text-[1.7rem] leading-tight text-ink">临床参考</h1>
            <p className="text-sm text-ink-mute mt-1">整合康复医学评估规范、临床路径、疾病诊疗与循证指南的快速参考手册。</p>
          </div>
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            className="input pl-8 w-full"
            placeholder="搜索疾病、评估、治疗方案…"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* 左侧导航 */}
        <aside className="lg:w-[200px] shrink-0">
          <div className="card p-2 sticky top-[80px] space-y-1">
            {REFERENCE_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors text-left",
                  activeSection === sec.id
                    ? "bg-teal-500 text-white font-medium"
                    : "text-ink-soft hover:bg-cream-200"
                )}
              >
                <sec.icon className="h-4 w-4 shrink-0" />
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* 右侧内容区 */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* 评估规范 */}
          {activeSection === "assessment" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">康复评估规范</h2>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-5">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-teal-700 leading-relaxed">
                      <p className="font-medium mb-1">评估原则</p>
                      <p>功能导向、动态跟踪、多维度整合。入院24小时内启动，急性期每3-5天复评，稳定期每2周复评，出院前完成终末评估。</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "运动功能评估",
                      items: [
                        "改良Ashworth量表（MAS）：肌张力 0-4级",
                        "徒手肌力检查（MMT）：肌力 0-5级",
                        "Berg平衡量表（BBS）：0-56分，≤45分跌倒高风险",
                        "Brunnstrom分期：Ⅰ-Ⅵ期，判断运动恢复阶段",
                      ],
                    },
                    {
                      title: "感觉功能评估",
                      items: [
                        "浅感觉：痛觉、温度觉、触觉",
                        "深感觉：关节位置觉、运动觉、振动觉",
                        "复合感觉：两点辨别觉、实体觉",
                        "糖尿病周围神经病变：10g尼龙丝压力觉测试",
                      ],
                    },
                    {
                      title: "日常生活活动能力",
                      items: [
                        "改良巴氏指数（MBI）：0-100分，≤60分需长期照护",
                        "基础ADL（BADL）：进食、穿衣、如厕等10项",
                        "工具性ADL（IADL）：购物、做饭、财务管理等",
                        "WHODAS 2.0：环境适应力与社会参与评估",
                      ],
                    },
                    {
                      title: "临床症状评估",
                      items: [
                        "疼痛：NRS数字评分（0-10分）+ McGill疼痛问卷",
                        "吞咽：洼田饮水试验初筛，VFSS明确诊断",
                        "认知：MMSE筛查（≤24分认知损害），MoCA详细评估",
                        "心理：PHQ-9抑郁量表、PSQI睡眠质量指数",
                      ],
                    },
                  ].map((block, i) => (
                    <div key={i} className="rounded border border-line p-4">
                      <h3 className="font-medium text-ink mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-coral" />
                        {block.title}
                      </h3>
                      <ul className="space-y-2">
                        {block.items.map((item, j) => (
                          <li key={j} className="text-sm text-ink-soft flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 text-teal-500 mt-1 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* SOAP评估框架 */}
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">SOAP评估框架</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-3">
                  {SOAP_FRAMEWORK.map((m, i) => (
                    <div key={i} className="rounded border border-line bg-surface p-3">
                      <p className="text-sm font-medium text-teal-600 mb-2">{m.module}</p>
                      <p className="text-2xs text-ink-soft leading-relaxed mb-2">{m.content}</p>
                      <div className="text-2xs text-ink-mute bg-cream-100 rounded p-2">
                        <p className="font-medium text-coral mb-1">神经科示例：</p>
                        <p>{m.neuroExample}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 神经康复 */}
          {activeSection === "neuro" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">脑卒中康复路径</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {STROKE_CRITICAL_PATHWAY.map((phase, idx) => (
                    <div key={idx} className="rounded border border-line bg-surface p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-coral">{phase.stage}</p>
                        <span className="chip text-2xs">{phase.time}</span>
                      </div>
                      <p className="text-2xs text-ink-soft leading-relaxed mb-2"><span className="font-medium text-teal-600">目标：</span>{phase.goal}</p>
                      <p className="text-2xs text-ink-mute leading-relaxed"><span className="font-medium">措施：</span>{phase.measures}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">Brunnstrom偏瘫恢复分期</h2>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {BRUNNSTROM_STAGES.map((stage, idx) => (
                    <div key={idx} className="rounded border border-line bg-surface p-3">
                      <p className="text-sm font-display text-teal-600 mb-1 text-center">{stage.stage.split("(")[0]}</p>
                      <p className="text-2xs text-ink-mute mb-2 text-center">{stage.feature}</p>
                      <div className="space-y-1 text-2xs">
                        <div>
                          <span className="text-coral font-medium">上肢：</span>
                          <span className="text-ink-soft">{stage.upperLimb}</span>
                        </div>
                        <div>
                          <span className="text-coral font-medium">手：</span>
                          <span className="text-ink-soft">{stage.hand}</span>
                        </div>
                        <div>
                          <span className="text-coral font-medium">下肢：</span>
                          <span className="text-ink-soft">{stage.lowerLimb}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-line">
                        <p className="text-2xs text-teal-600">{stage.intervention}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">脊髓损伤（SCI）康复目标</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-ink-mute">
                        <th className="py-2 pr-3 font-medium">损伤平面</th>
                        <th className="py-2 pr-3 font-medium">关键肌</th>
                        <th className="py-2 pr-3 font-medium">基本目标</th>
                        <th className="py-2 pr-3 font-medium">自理能力</th>
                        <th className="py-2 pr-3 font-medium">轮椅</th>
                        <th className="py-2 pr-3 font-medium">步行</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {SCI_LEVELS.slice(0, 8).map((level, i) => (
                        <tr key={i} className="hover:bg-cream-50/60">
                          <td className="py-2 pr-3 text-teal-600 font-medium">{level.level}</td>
                          <td className="py-2 pr-3 text-ink-soft text-xs">{level.keyMuscle}</td>
                          <td className="py-2 pr-3 text-ink text-xs">{level.basicGoal}</td>
                          <td className="py-2 pr-3 text-ink-soft text-xs">{level.selfCare}</td>
                          <td className="py-2 pr-3 text-ink-soft text-xs">{level.wheelchair}</td>
                          <td className="py-2 pr-3 text-ink-soft text-xs">{level.walking}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="h-5 w-5 text-amber-dark" />
                  <h2 className="font-display text-xl text-ink">痉挛管理方案</h2>
                </div>
                <div className="space-y-4">
                  {SPASM_MANAGEMENT.map((s, i) => (
                    <div key={i} className="rounded border border-line bg-surface p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <p className="text-sm font-medium text-ink">{s.disease}</p>
                          <p className="text-2xs text-ink-mute mt-0.5">{s.pattern}</p>
                        </div>
                        <span className="chip text-2xs">评估：{s.assessment}</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="text-2xs">
                          <p className="font-medium text-coral mb-1">口服药物</p>
                          <p className="text-ink-soft">{s.oralDrug}</p>
                        </div>
                        <div className="text-2xs">
                          <p className="font-medium text-coral mb-1">注射治疗</p>
                          <p className="text-ink-soft">{s.injection}</p>
                        </div>
                        <div className="text-2xs">
                          <p className="font-medium text-coral mb-1">康复治疗</p>
                          <p className="text-ink-soft">{s.pt}</p>
                        </div>
                        <div className="text-2xs">
                          <p className="font-medium text-teal-600 mb-1">矫形器</p>
                          <p className="text-ink-soft">{s.orthosis}</p>
                        </div>
                        <div className="text-2xs">
                          <p className="font-medium text-teal-600 mb-1">手术</p>
                          <p className="text-ink-soft">{s.surgery}</p>
                        </div>
                        <div className="text-2xs">
                          <p className="font-medium text-amber-700 mb-1">注意事项</p>
                          <p className="text-ink-soft">{s.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-coral" />
                  <h2 className="font-display text-xl text-ink">帕金森病（PD）康复路径</h2>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {PD_PATHWAY.map((phase, idx) => (
                    <div key={idx} className="rounded border border-line bg-surface p-4">
                      <p className="text-sm font-medium text-coral mb-1">{phase.stage}</p>
                      <p className="text-2xs text-teal-600 mb-2">{phase.hY}</p>
                      <p className="text-2xs text-ink-soft leading-relaxed mb-2"><span className="font-medium">症状：</span>{phase.symptoms}</p>
                      <div className="text-2xs text-ink-mute bg-cream-100 rounded p-2">
                        <p className="font-medium text-teal-600 mb-1">康复：</p>
                        <p>{phase.rehab}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 骨科康复 */}
          {activeSection === "ortho" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">康复分期总览</h2>
                </div>
                <div className="space-y-3">
                  {REHAB_STAGES.map((stage, i) => (
                    <div key={i} className="rounded border border-line p-4 hover:border-teal-300 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="font-medium text-ink flex items-center gap-2">
                            <span className="h-6 w-6 grid place-items-center rounded-full bg-teal-500 text-white text-xs">
                              {i + 1}
                            </span>
                            {stage.stage}
                          </h3>
                          <p className="text-2xs text-ink-mute mt-1">时间窗：{stage.time}</p>
                        </div>
                        <span className="chip text-2xs bg-amber-50 text-amber-700 border-amber-200">
                          核心措施：{stage.coreMeasures}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <div className="text-sm text-ink-soft">
                          <span className="font-medium text-teal-600">目标：</span>{stage.goal}
                        </div>
                        <div className="text-sm text-ink-soft">
                          <span className="font-medium text-coral">关键判断：</span>{stage.keyJudgment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">重返运动/功能标准</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-ink-mute">
                        <th className="py-2 pr-3 font-medium">类别</th>
                        <th className="py-2 pr-3 font-medium">测试项目</th>
                        <th className="py-2 pr-3 font-medium">阈值标准</th>
                        <th className="py-2 pr-3 font-medium">腘绳肌</th>
                        <th className="py-2 pr-3 font-medium">股四头肌</th>
                        <th className="py-2 pr-3 font-medium">踝</th>
                        <th className="py-2 pr-3 font-medium">肩袖</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {RETURN_STANDARDS.map((r, i) => (
                        <tr key={i} className="hover:bg-cream-50/60">
                          <td className="py-2 pr-3 text-coral font-medium">{r.category}</td>
                          <td className="py-2 pr-3 text-ink">{r.test}</td>
                          <td className="py-2 pr-3 text-teal-600">{r.threshold}</td>
                          <td className="py-2 pr-3 text-ink-soft text-center">{r.hamstring}</td>
                          <td className="py-2 pr-3 text-ink-soft text-center">{r.quadriceps}</td>
                          <td className="py-2 pr-3 text-ink-soft text-center">{r.ankle}</td>
                          <td className="py-2 pr-3 text-ink-soft text-center">{r.rotatorCuff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">常见骨科术后康复要点</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "髋关节置换（THA）",
                      points: [
                        "术后24h启动股四头肌等长收缩（5×20次/日）",
                        "避免髋内收>45°、屈曲>90°（防脱位）",
                        "术后3天扶双拐行走，患肢部分负重≤1/3体重",
                        "2周后过渡至单拐，6周弃拐",
                      ],
                    },
                    {
                      title: "膝关节置换（TKA）",
                      points: [
                        "术后即刻使用CPM机，0°-30°起始，每日增加10°",
                        "目标：2周达90°屈曲",
                        "肿胀明显者予间歇性气压治疗（40-60mmHg）",
                        "股四头肌肌力3级时予NMES神经肌肉电刺激",
                      ],
                    },
                    {
                      title: "四肢骨折术后",
                      points: [
                        "骨科处置完成后24h内启动康复",
                        "骨折部位等长收缩，相邻关节主动/被动运动",
                        "防治深静脉血栓、关节粘连、肌肉萎缩",
                        "根据固定方式制定负重时间进度表",
                      ],
                    },
                    {
                      title: "运动创伤术后",
                      points: [
                        "临床专科处置完成后24h内启动",
                        "准确把握关节活动范围和牵伸强度",
                        "循序渐进，避免二次损伤",
                        "重视本体感觉训练和神经肌肉控制",
                      ],
                    },
                  ].map((item, i) => (
                    <div key={i} className="rounded border border-line p-4">
                      <h3 className="font-medium text-ink mb-3">{item.title}</h3>
                      <ul className="space-y-2">
                        {item.points.map((p, j) => (
                          <li key={j} className="text-sm text-ink-soft flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 text-teal-500 mt-1 shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 疼痛治疗 */}
          {activeSection === "pain" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-coral" />
                  <h2 className="font-display text-xl text-ink">肌骨疼痛治疗方案</h2>
                  <span className="text-2xs text-ink-mute">共 {filteredPainConditions.length} 种疾病</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSearchKeyword("")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition",
                      !searchKeyword
                        ? "bg-coral text-white border-coral"
                        : "bg-cream-100 text-ink-soft border-line hover:border-coral"
                    )}
                  >
                    全部 ({PAIN_CONDITIONS.length})
                  </button>
                  {PAIN_CATEGORIES.map((c) => {
                    const count = PAIN_CONDITIONS.filter((p) => p.category === c.id).length;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSearchKeyword(c.name)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border transition",
                          searchKeyword === c.name
                            ? "bg-coral text-white border-coral"
                            : "bg-cream-100 text-ink-soft border-line hover:border-coral"
                        )}
                      >
                        {c.name} ({count})
                      </button>
                    );
                  })}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPainConditions.map((c) => (
                    <div
                      key={c.name}
                      className="rounded border border-line bg-surface p-4 cursor-pointer hover:border-coral transition-colors"
                      onClick={() => toggleItem(`pain-${c.name}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs text-ink-mute">{c.region}</span>
                          <h3 className="font-medium text-ink mt-0.5">{c.name}</h3>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-ink-faint transition-transform",
                            expandedItems[`pain-${c.name}`] && "rotate-180"
                          )}
                        />
                      </div>
                      {c.symptoms && c.symptoms.length > 0 && (
                        <p className="text-xs text-ink-soft line-clamp-2">{c.symptoms[0]}</p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-line">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded border",
                            c.evidenceLevel === "A"
                              ? "bg-teal-100 text-teal-700 border-teal-300"
                              : c.evidenceLevel === "B"
                              ? "bg-amber-50 text-amber-700 border-amber-300"
                              : "bg-cream-200 text-ink-soft border-line"
                          )}
                        >
                          {c.evidenceLevel} 级证据
                        </span>
                        <span className="text-xs text-ink-mute">{c.treatment.length} 项治疗</span>
                      </div>

                      {expandedItems[`pain-${c.name}`] && (
                        <div className="mt-4 pt-4 border-t border-line space-y-3">
                          {c.causes && c.causes.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-coral mb-1.5">病因 / 危险因素</p>
                              <ul className="space-y-1">
                                {c.causes.map((s, i) => (
                                  <li key={i} className="text-xs text-ink-soft flex items-start gap-1.5">
                                    <ChevronRight className="h-3 w-3 text-teal-500 mt-0.5 shrink-0" />
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {c.symptoms && c.symptoms.length > 1 && (
                            <div>
                              <p className="text-xs font-medium text-coral mb-1.5">临床表现</p>
                              <ul className="space-y-1">
                                {c.symptoms.slice(1).map((s, i) => (
                                  <li key={i} className="text-xs text-ink-soft flex items-start gap-1.5">
                                    <ChevronRight className="h-3 w-3 text-teal-500 mt-0.5 shrink-0" />
                                    <span>{s}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-coral mb-1.5">治疗方案</p>
                            <ol className="space-y-1 pl-4 list-decimal">
                              {c.treatment.map((s, i) => (
                                <li key={i} className="text-xs text-ink-soft">{s}</li>
                              ))}
                            </ol>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-coral mb-1.5">预防</p>
                            <p className="text-xs text-ink-soft">{c.prevention}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredPainConditions.length === 0 && (
                  <div className="text-center py-10 text-ink-mute">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>未找到匹配的疼痛方案</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* 红旗征 */}
          {activeSection === "redflags" && (
            <section className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-coral" />
                <h2 className="font-display text-xl text-ink">红旗征警示系统</h2>
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
          )}

          {/* 肌肉参考 */}
          {activeSection === "muscle" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">身体区域速查</h2>
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

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">肌肉疾病映射</h2>
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

              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">肌肉快速参考</h2>
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
            </div>
          )}

          {/* 康复分期 */}
          {activeSection === "stages" && (
            <div className="space-y-5">
              <section className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  <h2 className="font-display text-xl text-ink">康复治疗六阶段</h2>
                </div>
                <div className="relative">
                  <div className="absolute left-[20px] top-4 bottom-4 w-0.5 bg-teal-200" />
                  <div className="space-y-5">
                    {REHAB_STAGES.map((stage, i) => (
                      <div key={i} className="relative flex gap-4">
                        <div className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-teal-500 text-white font-display shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 rounded border border-teal-200 bg-teal-50/30 p-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="font-display text-lg text-ink">{stage.stage}</h3>
                              <p className="text-2xs text-ink-mute mt-0.5">时间窗：{stage.time}</p>
                            </div>
                            <span className="chip text-xs bg-amber-50 text-amber-700 border-amber-200">
                              {stage.coreMeasures}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3 mt-3">
                            <div className="bg-white/60 rounded p-3">
                              <p className="text-xs font-medium text-teal-600 mb-1">康复目标</p>
                              <p className="text-sm text-ink-soft">{stage.goal}</p>
                            </div>
                            <div className="bg-white/60 rounded p-3">
                              <p className="text-xs font-medium text-coral mb-1">关键判断</p>
                              <p className="text-sm text-ink-soft">{stage.keyJudgment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 循证更新 */}
          {activeSection === "evidence" && (
            <section className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-amber-dark" />
                <h2 className="font-display text-xl text-ink">重点肌肉循证更新</h2>
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
          )}
        </main>
      </div>
    </div>
  );
}
