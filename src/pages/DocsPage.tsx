import { BookOpen, FileText, ChevronRight, Lightbulb, Sparkles, Layers, Activity, Wrench, BarChart3, ClipboardList, CalendarRange, Route, Users, Brain, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  body: string;
}

const SECTIONS: { id: string; title: string; icon: typeof BookOpen; desc: string; items: DocItem[] }[] = [
  {
    id: "patient",
    title: "患者档案",
    icon: Users,
    desc: "建立与管理患者档案、智能粘贴主诉/现病史自动识别。",
    items: [
      { id: "create", title: "新建患者", body: "在「患者档案」页面点击「新建患者」按钮即可创建档案。支持姓名、年龄、性别、诊断、标签、亚专科等字段。" },
      { id: "paste", title: "智能粘贴", body: "在新建或编辑档案时点击「智能粘贴」按钮，粘贴主诉/现病史/既往史等文字，系统将自动识别姓名、性别、年龄、诊断等字段。" },
      { id: "tags", title: "标签与分类", body: "标签与亚专科用于自动推荐临床路径；可在档案中后期补充更多标签。" },
    ],
  },
  {
    id: "assess",
    title: "评估中心",
    icon: ClipboardList,
    desc: "使用量表进行结构化评估，生成可视化报告。",
    items: [
      { id: "pick", title: "选择量表", body: "评估中心提供 Barthel、Berg、Fugl-Meyer、Brunnstrom、Ashworth 等量表，按亚专科和难度筛选。" },
      { id: "runner", title: "快速记录（智能粘贴）", body: "在评估作答页点击「快速记录」，粘贴医嘱/查体文字（如 VAS 5/10、肩前屈 120°），系统将识别并自动填入对应题目。" },
      { id: "report", title: "评估报告", body: "提交后自动生成报告，包括总分、维度雷达图、临床解读与个性化建议。支持导出 PDF / Word / Excel / 思维导图。" },
    ],
  },
  {
    id: "plan",
    title: "康复计划",
    icon: CalendarRange,
    desc: "基于评估结果生成个性化周计划，追踪每日打卡。",
    items: [
      { id: "from-assess", title: "从评估生成", body: "在评估报告页点击「基于本次评估生成康复计划」，系统会根据短板维度推荐训练动作。" },
      { id: "edit", title: "编辑周计划", body: "在计划编辑页调整每日训练内容、组数、次数、负荷与备注；支持 7 天日程可视化。" },
      { id: "checkin", title: "每日打卡", body: "在进度追踪页可一键打卡，记录 RPE、疼痛等指标，生成趋势曲线。" },
    ],
  },
  {
    id: "pathway",
    title: "临床路径",
    icon: Route,
    desc: "基于循证证据的康复阶段路径与达标推进。",
    items: [
      { id: "recommend", title: "智能推荐", body: "选择患者后系统将根据诊断与最近评估分数推荐匹配度最高的临床路径。" },
      { id: "import", title: "病例导入", body: "点击「病例导入」粘贴一段病例描述，系统自动识别标签并推荐合适的路径，点击「启用」即可为该患者启动。" },
      { id: "advance", title: "阶段推进", body: "患者达到本阶段里程碑后，点击「达标，推进下一阶段」即可更新路径进度。" },
    ],
  },
  {
    id: "progress",
    title: "进度追踪",
    icon: BarChart3,
    desc: "追踪患者训练执行、疼痛与功能变化趋势。",
    items: [
      { id: "trends", title: "多维趋势", body: "提供 RPE、疼痛、关节活动度、肌力等多维趋势曲线，窗口可选 7/14/30 天。" },
      { id: "compliance", title: "依从率", body: "基于打卡数据自动计算依从率，帮助治疗师评估患者执行力。" },
    ],
  },
  {
    id: "quiz",
    title: "刷题中心",
    icon: Brain,
    desc: "覆盖八大康复专题的题库与四大学习模式。",
    items: [
      { id: "modes", title: "四种模式", body: "顺序模式、随机模式、错题回顾、模拟考试（20 题 20 分钟计时）。" },
      { id: "stats", title: "学习统计", body: "累计答题数、正确率、连续学习天数、各分类正确率一应俱全，可调整每日目标。" },
      { id: "bookmarks", title: "收藏与错题本", body: "点击星标收藏重点题；错题自动收录到「错题本」，可逐题巩固。" },
    ],
  },
  {
    id: "export",
    title: "报告导出",
    icon: FileText,
    desc: "支持 PDF / Word / Excel / 思维导图多种格式导出。",
    items: [
      { id: "pdf", title: "PDF 导出", body: "使用 jspdf + html2canvas 将报告页渲染为 PDF，支持跨页。" },
      { id: "word", title: "Word 导出", body: "使用 docx 库生成结构化 Word 文档，包含表格、标题、段落。" },
      { id: "excel", title: "Excel 导出", body: "使用 xlsx 库导出概览/维度/题目作答三个工作表，便于二次分析。" },
      { id: "mindmap", title: "思维导图", body: "使用 SVG 自绘的脑图，以患者为中心节点、维度为支线；可预览与下载 PNG。" },
    ],
  },
];

export default function DocsPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Documentation</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">使用文档</h1>
          <p className="text-sm text-ink-mute mt-1">快速了解康衡平台各模块的功能与最佳实践。</p>
        </div>
        <button onClick={() => navigate("/")} className="btn-ghost btn-sm">
          返回工作台
        </button>
      </header>

      <section className="card p-5 bg-gradient-to-br from-teal-50 to-amber-soft/30">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-coral" />
          <h2 className="section-title">快速开始</h2>
        </div>
        <ol className="text-sm text-ink-soft leading-relaxed list-decimal pl-5 space-y-1">
          <li>在「患者档案」中新建一名患者，建议使用「智能粘贴」自动填充。</li>
          <li>在「评估中心」选择量表发起评估，可借助「快速记录」智能填入。</li>
          <li>评估完成后即可生成报告，导出为 PDF/Word/Excel 或脑图。</li>
          <li>基于评估生成康复计划，追踪每日进度，必要时启用临床路径。</li>
          <li>闲暇之余可在「刷题中心」巩固专业知识，按学习统计追踪成长。</li>
        </ol>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {SECTIONS.map((sec) => (
          <section key={sec.id} className="card p-5">
            <div className="flex items-center gap-2 mb-1">
              <sec.icon className="h-4 w-4 text-teal-500" />
              <h2 className="font-display text-lg text-ink">{sec.title}</h2>
            </div>
            <p className="text-2xs text-ink-mute mb-3 leading-relaxed">{sec.desc}</p>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <details key={item.id} className="rounded border border-line bg-cream-50/40 group">
                  <summary className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-ink-soft hover:text-teal-500">
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                    <span className="flex-1">{item.title}</span>
                  </summary>
                  <p className="px-3 pb-3 text-2xs text-ink-mute leading-relaxed">{item.body}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-amber-dark" />
          <h2 className="section-title">常见问题</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-2xs text-ink-mute">
          <div className="rounded border border-line p-3">
            <p className="font-medium text-ink-soft mb-1">Q：数据是否会上传云端？</p>
            <p className="leading-relaxed">A：当前演示版本将所有数据保存在浏览器 localStorage，重置浏览器数据将清空记录。</p>
          </div>
          <div className="rounded border border-line p-3">
            <p className="font-medium text-ink-soft mb-1">Q：能多设备同步吗？</p>
            <p className="leading-relaxed">A：未来版本将支持云端账号体系与团队协作；当前主要为单机演示。</p>
          </div>
          <div className="rounded border border-line p-3">
            <p className="font-medium text-ink-soft mb-1">Q：智能粘贴识别不到？</p>
            <p className="leading-relaxed">A：请在粘贴文字中显式包含「姓名：」「男/女」「X 岁」「主诉：」「诊断：」等关键词。</p>
          </div>
          <div className="rounded border border-line p-3">
            <p className="font-medium text-ink-soft mb-1">Q：导出 Word/Excel 中文乱码？</p>
            <p className="leading-relaxed">A：docx 库采用 UTF-8 编码，使用 WPS / Office 2016+ 打开均无乱码。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
