import { useNavigate } from "react-router-dom";
import { Activity, Mail, BadgeCheck, User as UserIcon, LogOut, Calendar, ShieldCheck, Stethoscope, Database } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.info("已退出登录");
    navigate("/login", { replace: true });
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
