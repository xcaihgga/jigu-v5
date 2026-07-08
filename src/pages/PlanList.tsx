import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CalendarRange, Plus, ArrowRight, CalendarClock, User } from "lucide-react";
import { assess, plan, progress } from "@/services";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/store/ui";
import { fmtDate } from "@/lib/storage";
import EmptyState from "@/components/ui/EmptyState";
import ProgressRing from "@/components/ui/ProgressRing";

const DAY_LABEL = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default function PlanList() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useAuthStore();

  const plans = useMemo(() => plan.list(), []);

  // 从评估报告跳转来时自动生成计划
  useEffect(() => {
    const from = params.get("from");
    if (from && user) {
      const existing = plan.list().find((p) => p.recordId === from);
      if (existing) {
        navigate(`/plan/${existing.id}`, { replace: true });
        return;
      }
      const rec = assess.getRecord(from);
      if (rec) {
        const newPlan = plan.generateFrom(from, user.id);
        if (newPlan) {
          toast.success("已基于评估生成计划草稿");
          navigate(`/plan/${newPlan.id}`, { replace: true });
          return;
        }
      }
    }
  }, [params, user, navigate]);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="label-text">Rehab Plan</p>
          <h1 className="font-display text-[1.7rem] leading-tight text-ink">康复计划</h1>
          <p className="text-sm text-ink-mute mt-1">基于评估生成可编辑的训练计划，按周日程排期。</p>
        </div>
        <button onClick={() => navigate("/assess")} className="btn-primary">
          <Plus className="h-4 w-4" /> 从评估生成计划
        </button>
      </header>

      {plans.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<CalendarRange className="h-12 w-12" />}
            title="还没有康复计划"
            desc="完成一次评估后，可一键生成个性化训练计划草稿。"
            action={<button onClick={() => navigate("/assess")} className="btn-primary btn-sm">去评估中心</button>}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 stagger">
          {plans.map((p) => {
            const cr = progress.completionRate(p.id, 14);
            const totalEntries = p.schedule.reduce((acc, d) => acc + d.entries.length, 0);
            return (
              <div key={p.id} className="card p-5 hover:shadow-lift transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {p.active && <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-2xs text-teal-600"><span className="h-1.5 w-1.5 rounded-full bg-teal-500" />执行中</span>}
                      <span className="text-2xs text-ink-mute">{fmtDate(p.createdAt)}</span>
                    </div>
                    <h3 className="font-display text-lg text-ink leading-tight">{p.title}</h3>
                    <p className="text-sm text-ink-mute mt-0.5 inline-flex items-center gap-1"><User className="h-3 w-3" />{p.patientName}</p>
                  </div>
                  <ProgressRing value={cr.rate} size={52} />
                </div>

                <p className="text-xs text-ink-soft mt-3 line-clamp-2">{p.goal}</p>

                <div className="flex items-center gap-1 mt-4">
                  {p.schedule.slice(1).concat(p.schedule[0]).map((d) => (
                    <div key={d.day} className="flex-1 text-center">
                      <div className={`h-7 rounded text-2xs flex items-center justify-center ${d.entries.length > 0 ? "bg-teal-50 text-teal-600 font-medium" : "bg-cream-100 text-ink-faint"}`}>
                        {DAY_LABEL[d.day].slice(1)}
                      </div>
                      <span className="text-2xs text-ink-faint mt-1 inline-block">{d.entries.length || "—"}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
                  <span className="text-2xs text-ink-mute inline-flex items-center gap-1">
                    <CalendarClock className="h-3 w-3" /> {totalEntries} 项动作 · {p.durationWeeks} 周
                  </span>
                  <button onClick={() => navigate(`/plan/${p.id}`)} className="text-sm text-teal-500 font-medium inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                    编辑计划 <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
