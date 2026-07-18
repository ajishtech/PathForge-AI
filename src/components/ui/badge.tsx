import { cn, getProficiencyColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "proficiency" | "success" | "warning";
  proficiency?: string;
  className?: string;
}

export function Badge({ children, variant = "default", proficiency, className }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    proficiency: proficiency ? getProficiencyColor(proficiency) : "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-800 overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
