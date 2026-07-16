import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Shield, UserCog, UserPlus, Trash2, Edit3, Activity, ClipboardList, CalendarRange, TrendingUp, X, Save, Search } from "lucide-react";
import { users, assess, plan as planSvc, progress as progressSvc } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";
import { cn } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import type { Role, User } from "@/lib/types";

const ROLE_LABEL: Record<Role, string> = {
  admin: "管理员",
  therapist: "治疗师",
  patient: "患者",
  visitor: "访客",
};

const ROLE_TONE: Record<Role, string> = {
  admin: "bg-coral-soft/30 text-coral-dark",
  therapist: "bg-teal-50 text-teal-600",
  patient: "bg-amber-50 text-amber-dark",
  visitor: "bg-cream-200 text-ink-mute",
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  const list = useMemo(() => users.list(), [tick]);
  const stats = useMemo(() => users.stats(), [tick]);

  const filtered = useMemo(() => {
    return list.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [list, query, roleFilter]);

  // 当前用户必须是管理员
  if (currentUser?.role !== "admin") {
    return (
      <div className="card p-12 text-center">
        <Shield className="h-12 w-12 text-ink-faint mx-auto mb-3" />
        <h2 className="font-display text-lg text-ink mb-2">无权访问</h2>
        <p className="text-sm text-ink-mute">仅系统管理员可进入此页面</p>
        <button onClick={() => navigate("/")} className="btn-ghost btn-sm mt-4">返回工作台</button>
      </div>
    );
  }

  const handleDelete = (u: User) => {
    if (u.id === currentUser.id) {
      toast.error("不能删除当前登录的管理员");
      return;
    }
    if (confirm(`确定删除账户「${u.name}」(${u.email})？此操作不可撤销。`)) {
      users.remove(u.id);
      toast.success("账户已删除");
      setTick((t) => t + 1);
    }
  };

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">System Administration</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">账户与系统总览</h1>
          <p className="text-sm text-ink-mute mt-1">管理员可管理治疗师与患者账户，查看平台全局数据。</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" /> 新建账户
        </button>
      </header>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "总账户", value: stats.totalUsers, icon: Users, tone: "text-teal-500" },
          { label: "治疗师", value: stats.therapists, icon: UserCog, tone: "text-coral" },
          { label: "评估记录", value: stats.totalRecords, icon: ClipboardList, tone: "text-amber-dark" },
          { label: "活跃计划", value: stats.totalPlans, icon: CalendarRange, tone: "text-teal-500" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <s.icon className={cn("h-4 w-4", s.tone)} strokeWidth={1.7} />
            <p className="stat-num text-2xl text-ink mt-2">{s.value}</p>
            <p className="text-2xs text-ink-mute">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3.5 w-3.5 text-coral" />
            <p className="text-2xs text-ink-mute">患者数</p>
          </div>
          <p className="stat-num text-xl text-ink">{stats.patients}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3.5 w-3.5 text-coral" />
            <p className="text-2xs text-ink-mute">管理员数</p>
          </div>
          <p className="stat-num text-xl text-ink">{stats.admins}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-teal-500" />
            <p className="text-2xs text-ink-mute">打卡总数</p>
          </div>
          <p className="stat-num text-xl text-ink">{stats.totalCheckins}</p>
        </div>
      </div>

      {/* 筛选与搜索 */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 text-ink-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名或邮箱"
            className="input flex-1"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "all" | Role)} className="input w-auto">
          <option value="all">全部角色</option>
          <option value="admin">管理员</option>
          <option value="therapist">治疗师</option>
          <option value="patient">患者</option>
        </select>
      </div>

      {/* 账户列表 */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100/60 text-2xs uppercase tracking-wider text-ink-mute">
            <tr>
              <th className="text-left px-4 py-3 font-medium">用户</th>
              <th className="text-left px-4 py-3 font-medium">角色</th>
              <th className="text-left px-4 py-3 font-medium">执业编号</th>
              <th className="text-left px-4 py-3 font-medium">注册时间</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-mute">没有匹配的账户</td>
              </tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="hover:bg-cream-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-500 text-cream-50 text-2xs font-medium shrink-0">
                      {u.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-ink font-medium truncate">{u.name}</p>
                      <p className="text-2xs text-ink-mute truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-2xs", ROLE_TONE[u.role])}>{ROLE_LABEL[u.role]}</span>
                </td>
                <td className="px-4 py-3 text-2xs text-ink-mute">{u.license || "—"}</td>
                <td className="px-4 py-3 text-2xs text-ink-mute">{fmtDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => setEditing(u)} className="p-1.5 rounded hover:bg-cream-200" title="编辑">
                      <Edit3 className="h-3.5 w-3.5 text-ink-mute" />
                    </button>
                    {u.id !== currentUser.id && (
                      <button onClick={() => handleDelete(u)} className="p-1.5 rounded hover:bg-coral-soft/40" title="删除">
                        <Trash2 className="h-3.5 w-3.5 text-coral" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <UserFormModal
          user={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); setTick((t) => t + 1); }}
        />
      )}
    </div>
  );
}

function UserFormModal({
  user,
  onClose,
  onSaved,
}: {
  user: User | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(user?.role ?? "therapist");
  const [license, setLicense] = useState(user?.license ?? "");

  const isEdit = !!user;

  const save = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("请填写姓名和邮箱");
      return;
    }
    if (!isEdit && !password.trim()) {
      toast.error("请填写密码");
      return;
    }
    try {
      if (isEdit) {
        const patch: Partial<User> = { name, email, role: role as "admin" | "therapist" | "patient", license: license || undefined };
        if (password.trim()) patch.password = password;
        users.update(user!.id, patch);
        toast.success("账户已更新");
      } else {
        users.create({ name, email, password, role: role as "admin" | "therapist" | "patient", license: license || undefined });
        toast.success("账户已创建");
      }
      onSaved();
    } catch (e: any) {
      toast.error(e?.message || "操作失败");
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? `编辑账户 · ${user!.name}` : "新建账户"}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost btn-sm">取消</button>
          <button onClick={save} className="btn-primary btn-sm"><Save className="h-3.5 w-3.5" /> 保存</button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="label-text">姓名 <span className="text-coral">*</span></label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label-text">邮箱 <span className="text-coral">*</span></label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEdit && user!.email === "admin@rh.com"} />
        </div>
        <div>
          <label className="label-text">{isEdit ? "重置密码（留空则不修改）" : "密码"} {!isEdit && <span className="text-coral">*</span>}</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEdit ? "留空保持原密码" : ""} />
        </div>
        <div>
          <label className="label-text">角色</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="admin">管理员</option>
            <option value="therapist">治疗师</option>
            <option value="patient">患者</option>
          </select>
        </div>
        {role === "therapist" && (
          <div>
            <label className="label-text">执业编号</label>
            <input className="input" value={license} onChange={(e) => setLicense(e.target.value)} placeholder="如 PT-2024-0001" />
          </div>
        )}
      </div>
    </Modal>
  );
}
