import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarRange,
  LineChart as LineChartIcon,
  Route,
  Users,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
  Brain,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "工作台", icon: LayoutDashboard, end: true },
  { to: "/assess", label: "评估中心", icon: ClipboardCheck },
  { to: "/plan", label: "康复计划", icon: CalendarRange },
  { to: "/progress", label: "进度追踪", icon: LineChartIcon },
  { to: "/pathway", label: "临床路径", icon: Route },
  { to: "/patients", label: "患者档案", icon: Users },
  { to: "/quiz", label: "进修中心", icon: Brain },
  { to: "/docs", label: "使用文档", icon: BookOpen },
  { to: "/profile", label: "个人中心", icon: Settings },
];

function todayLabel() {
  const d = new Date();
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()];
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 · ${week}`;
}

export default function Layout() {
  const { user, logout, ready } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (ready && !user) navigate("/login", { replace: true });
  }, [ready, user, navigate]);

  if (!user) return null;

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to) && n.to !== "/"));
  const handleLogout = () => {
    logout();
    toast.info("已退出登录");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* 侧边栏 */}
      <aside
        className={cn(
          "sticky top-0 h-screen shrink-0 border-r border-line bg-cream-50/70 backdrop-blur flex flex-col transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[230px]",
        )}
      >
        <div className={cn("flex items-center gap-2.5 h-[60px] px-4 border-b border-line", collapsed && "justify-center px-0")}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="grid h-8 w-8 place-items-center rounded bg-teal-500 text-cream-50 shrink-0"
            title="折叠/展开"
          >
            <Activity className="h-4 w-4" strokeWidth={2.2} />
          </button>
          {!collapsed && (
            <div className="leading-none">
              <p className="font-display text-[1.05rem] text-ink">康衡</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-mute mt-1">Rehabalance</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded px-2.5 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-0",
                  isActive ? "bg-teal-500 text-cream-50 shadow-soft" : "text-ink-soft hover:bg-cream-200/60",
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* 用户卡 */}
        <div className={cn("border-t border-line p-2.5", collapsed && "px-1.5")}>
          <div className={cn("flex items-center gap-2.5 rounded bg-cream-200/50 p-2", collapsed && "justify-center p-1.5")}>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-500 text-cream-50 text-xs font-medium shrink-0">
              {user.name.slice(0, 1)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                <p className="text-2xs text-ink-mute">{user.role === "therapist" ? "治疗师" : user.role === "patient" ? "患者" : "访客"}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={handleLogout} className="text-ink-faint hover:text-coral" title="退出登录">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 主区 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-[60px] border-b border-line bg-cream-100/80 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-ink-faint">康衡</span>
            <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
            <span className="font-medium text-ink">{current?.label ?? "工作台"}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xs text-ink-mute hidden sm:block">{todayLabel()}</span>
            <div className="h-7 w-7 rounded-full bg-teal-500 text-cream-50 grid place-items-center text-xs font-medium">
              {user.name.slice(0, 1)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
