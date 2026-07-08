import type { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      {icon && <div className="text-ink-faint mb-3">{icon}</div>}
      <p className="font-display text-lg text-ink-soft">{title}</p>
      {desc && <p className="text-sm text-ink-mute mt-1 max-w-xs">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
