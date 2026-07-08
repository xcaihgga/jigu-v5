import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Bone, Brain, HeartPulse, Baby, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";
type Role = "therapist" | "patient";

export default function Login() {
  const navigate = useNavigate();
  const { login, register, enterVisitor } = useAuthStore();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("therapist");
  const [email, setEmail] = useState("therapist@rh.com");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("");
  const [license, setLicense] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("欢迎回来");
      } else {
        if (!name.trim()) throw new Error("请输入姓名");
        await register({ email, password, name, role, license: role === "therapist" ? license : undefined });
        toast.success("注册成功，已自动登录");
      }
      navigate("/");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "操作失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr]">
      {/* 左：品牌叙事 */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-teal-500 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(rgba(245,241,232,0.6) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-amber/15 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded bg-cream-50 text-teal-500">
              <Activity className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="font-display text-xl leading-none">康衡</p>
              <p className="text-2xs uppercase tracking-[0.3em] opacity-70 mt-0.5">Rehabalance</p>
            </div>
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-2xs uppercase tracking-[0.3em] opacity-60 mb-4">康复评估与训练在线平台</p>
          <h1 className="font-display text-[2.6rem] leading-[1.12] text-balance">
            从<span className=" italic text-amber"> 评估 </span>到<span className=" italic text-coral-soft"> 重启 </span>，<br />一条循证的康复之路。
          </h1>
          <p className="mt-5 text-sm leading-relaxed opacity-80 text-balance">
            覆盖肌骨、神经、心肺、儿童四大亚专科，整合分级评估量表、互动式训练计划与个性化临床路径，让规范化的康复管理开箱即用。
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
            {[
              { Icon: Bone, t: "肌骨", d: "12 项量表" },
              { Icon: Brain, t: "神经", d: "循证路径" },
              { Icon: HeartPulse, t: "心肺", d: "耐量追踪" },
              { Icon: Baby, t: "儿童", d: "发育评估" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex items-center gap-2.5 rounded border border-cream-50/15 px-3 py-2.5">
                <Icon className="h-4 w-4 opacity-80" strokeWidth={1.6} />
                <div>
                  <p className="text-sm font-medium leading-none">{t}</p>
                  <p className="text-2xs opacity-60 mt-1">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-2xs opacity-50">© 2026 康衡 Rehabalance · 临床演示用途</p>
      </div>

      {/* 右：表单 */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="grid h-9 w-9 place-items-center rounded bg-teal-500 text-cream-50">
              <Activity className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <p className="font-display text-xl text-ink">康衡 <span className="text-2xs uppercase tracking-[0.2em] text-ink-mute">Rehabalance</span></p>
          </div>

          <p className="label-text">{mode === "login" ? "欢迎回来" : "创建账户"}</p>
          <h2 className="font-display text-2xl text-ink mb-1">
            {mode === "login" ? "登录你的工作台" : "注册康衡账户"}
          </h2>
          <p className="text-sm text-ink-mute mb-6">评估 · 计划 · 追踪 · 路径，一站闭环。</p>

          {/* 模式切换 */}
          <div className="flex rounded border border-line p-0.5 mb-5 text-sm">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setErr(""); }}
                className={cn("flex-1 rounded py-1.5 font-medium transition-colors", mode === m ? "bg-teal-500 text-cream-50" : "text-ink-mute hover:text-ink")}
              >
                {m === "login" ? "登录" : "注册"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <div className="flex rounded border border-line p-0.5 mb-5 text-sm">
              {(["therapist", "patient"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn("flex-1 rounded py-1.5 font-medium transition-colors", role === r ? "bg-teal-500 text-cream-50" : "text-ink-mute hover:text-ink")}
                >
                  {r === "therapist" ? "治疗师" : "患者"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="label-text">姓名</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" />
              </div>
            )}
            <div>
              <label className="label-text">邮箱</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hospital.com" />
            </div>
            <div>
              <label className="label-text">密码</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 6 位" />
            </div>
            {mode === "register" && role === "therapist" && (
              <div>
                <label className="label-text">执业编号 <span className="lowercase tracking-normal text-ink-faint">（选填）</span></label>
                <input className="input" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="PT-2021-XXXX" />
              </div>
            )}

            {err && <p className="text-2xs text-coral-dark bg-coral-soft/30 border border-coral-soft rounded px-2.5 py-1.5">{err}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "login" ? "登录" : "注册并登录")}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-2xs text-ink-faint">
            <button onClick={() => { enterVisitor(); navigate("/"); }} className="hover:text-teal-500 transition-colors">
              以访客身份浏览 →
            </button>
            {mode === "login" && (
              <span>演示账号 therapist@rh.com / 123456</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
