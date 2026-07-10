import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Mail, BadgeCheck, User as UserIcon, LogOut, Calendar, ShieldCheck, Stethoscope, Database, BookOpen, ChevronDown, ChevronUp, Users, ClipboardCheck, CalendarRange, Route, FileText, Brain } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";

const DOC_SECTIONS = [
  {
    id: "patients",
    icon: Users,
    title: "患者档案",
    items: [
      { label: "添加患者", desc: "在患者档案页面点击「添加患者」，填写基本信息后保存。系统自动生成唯一患者ID。" },
      { label: "快速建档", desc: "支持从评估报告直接关联患者，或通过搜索已有患者进行关联。" },
      { label: "档案管理", desc: "可编辑患者信息、删除档案、查看评估历史与康复计划关联记录。" },
    ],
  },
  {
    id: "assess",
    icon: ClipboardCheck,
    title: "评估中心",
    items: [
      { label: "评估类型", desc: "功能评估包含日常活动能力、疼痛评估、运动功能等；特殊评估包含心肺评估、神经功能等专项量表。" },
      { label: "执行评估", desc: "选择量表后逐项填写评分，系统实时计算总分与分级结果。支持中途暂停保存草稿。" },
      { label: "报告解读", desc: "评估完成后自动生成可视化报告，包含得分趋势、分级判定与康复建议。" },
    ],
  },
  {
    id: "plan",
    icon: CalendarRange,
    title: "康复计划",
    items: [
      { label: "智能生成", desc: "从评估报告一键生成个性化计划，系统根据评估结果自动推荐训练内容与强度。" },
      { label: "自定义编排", desc: "支持手动编辑每日训练项、调整重复次数与组数、增减训练日。" },
      { label: "进度追踪", desc: "通过日历打卡记录训练完成情况，查看RPE、疼痛、ROM等指标趋势变化。" },
    ],
  },
  {
    id: "pathway",
    icon: Route,
    title: "临床路径",
    items: [
      { label: "路径选择", desc: "根据患者诊断选择对应的临床路径，系统提供标准化康复流程参考。" },
      { label: "神经康复", desc: "包含SCI损伤分级、脑卒中关键路径、帕金森全程路径等专科路径。" },
      { label: "SOAP记录", desc: "提供结构化SOAP评估框架，辅助完成规范的康复病历书写。" },
    ],
  },
  {
    id: "treatment",
    icon: FileText,
    title: "治疗方案",
    items: [
      { label: "方案汇总", desc: "整合常见疼痛、骨科损伤及康复治疗计划，支持按部位分类浏览。" },
      { label: "病因与表现", desc: "每个方案包含病因、临床表现、评估要点、治疗方案及预防措施。" },
      { label: "临床关联", desc: "方案内容与评估量表、康复计划相互关联，形成完整诊疗闭环。" },
    ],
  },
  {
    id: "quiz",
    icon: Brain,
    title: "进修中心",
    items: [
      { label: "知识测验", desc: "覆盖康复医学基础、评估量表应用、治疗技术等知识点的随机测验。" },
      { label: "错题回顾", desc: "记录答错题目，支持反复练习直到掌握相关知识点。" },
      { label: "学习进度", desc: "统计答题正确率与学习时长，追踪进修学习效果。" },
    ],
  },
];

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<string[]>(["patients"]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.info("已退出登录");
    navigate("/login", { replace: true });
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const roleLabel = user.role === "therapist" ? "康复治疗师" : user.role === "patient" ? "患者" : "访客";
  const roleColor = user.role === "therapist" ? "bg-teal-50 text-teal-600" : user.role === "patient" ? "bg-amber-soft/40 text-amber-dark" : "bg-cream-200 text-ink-mute";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <header>
        <p className="label-text">Profile</p>
        <h1 className="font-display text-[1.7rem] leading-tight text-ink">个人中心</h1>
      </header>

      {/* 身份卡 */}
      <div className="card overflow-hidden">
        <div className="bg-teal-500 px-6 py-5 relative">
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(rgba(245,241,232,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-cream-50 text-teal-500 text-2xl font-display">{user.name.slice(0, 1)}</div>
            <div>
              <h2 className="font-display text-2xl text-cream-50">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium ${roleColor}`}>
                  <ShieldCheck className="h-3 w-3" /> {roleLabel}
                </span>
                {user.license && <span className="inline-flex items-center gap-1 text-2xs text-cream-50/80"><BadgeCheck className="h-3 w-3" /> {user.license}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <InfoRow icon={Mail} label="邮箱" value={user.email || "—（访客）"} />
          <InfoRow icon={UserIcon} label="角色" value={roleLabel} />
          {user.license && <InfoRow icon={Stethoscope} label="执业编号" value={user.license} />}
          <InfoRow icon={Calendar} label="注册时间" value={fmtDate(user.createdAt)} />
        </div>
      </div>

      {/* 使用文档 */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">使用文档</h2>
        </div>
        <div className="space-y-3">
          {DOC_SECTIONS.map((section) => (
            <div key={section.id} className="border border-line rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium text-ink">{section.title}</span>
                </div>
                {openSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4 text-ink-mute" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-ink-mute" />
                )}
              </button>
              {openSections.includes(section.id) && (
                <div className="px-4 pb-4 space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="pl-7">
                      <p className="text-sm font-medium text-ink">{item.label}</p>
                      <p className="text-xs text-ink-mute mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 数据与隐私 */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-teal-500" />
          <h2 className="section-title">数据与本地存储</h2>
        </div>
        <p className="text-sm text-ink-mute leading-relaxed">
          本平台为演示版本，所有数据（账户、患者档案、评估、计划、打卡）均以明文形式存储于当前浏览器的 localStorage 中，不上传任何服务器。
          清除浏览器数据将重置全部记录并恢复演示数据。
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="rounded border border-line p-3.5">
            <p className="text-2xs text-ink-mute">存储位置</p>
            <p className="stat-num text-sm text-ink mt-1">localStorage · rh_*</p>
          </div>
          <div className="rounded border border-line p-3.5">
            <p className="text-2xs text-ink-mute">后端服务</p>
            <p className="stat-num text-sm text-ink mt-1">无（纯前端 mock）</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm("确定要重置所有演示数据吗？这将清除当前浏览器中的全部记录。")) {
              Object.keys(localStorage).filter((k) => k.startsWith("rh_")).forEach((k) => localStorage.removeItem(k));
              toast.success("已重置，即将刷新");
              setTimeout(() => window.location.reload(), 600);
            }
          }}
          className="btn-ghost btn-sm mt-4"
        >
          <Database className="h-3.5 w-3.5" /> 重置演示数据
        </button>
      </div>

      {/* 关于 */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-coral" />
          <h2 className="section-title">关于康衡</h2>
        </div>
        <p className="text-sm text-ink-mute leading-relaxed">
          康衡 Rehabalance 是一款面向康复医学科的在线评估与训练平台，覆盖肌骨、神经、心肺、儿童四大亚专科，
          整合分级评估量表、互动式训练计划、训练进度追踪与个性化临床路径推荐，致力于让规范化的康复管理开箱即用。
        </p>
        <p className="text-2xs text-ink-faint mt-4">© 2026 康衡 Rehabalance · 仅作临床演示用途</p>
      </div>

      <button onClick={handleLogout} className="btn-ghost w-full">
        <LogOut className="h-4 w-4" /> 退出登录
      </button>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-line last:border-0">
      <Icon className="h-4 w-4 text-ink-mute shrink-0" strokeWidth={1.7} />
      <span className="text-2xs text-ink-mute w-20">{label}</span>
      <span className="text-sm text-ink flex-1">{value}</span>
    </div>
  );
}
