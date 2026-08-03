import type { ElementType, ReactNode } from "react";

type MetricTone = "blue" | "emerald" | "amber" | "slate";

interface PageContainerProps {
  children: ReactNode;
  width?: "standard" | "wide";
  scrollable?: boolean;
}

export function PageContainer({
  children,
  width = "standard",
  scrollable = false,
}: PageContainerProps) {
  return (
    <main
      className={`min-h-full px-4 py-3 sm:px-6 sm:py-4 xl:px-6 xl:py-5 ${
        scrollable ? "lg:h-full lg:min-h-0 lg:overflow-hidden" : ""
      }`}
    >
      <div
        className={`mx-auto w-full ${width === "wide" ? "max-w-[1600px]" : "max-w-[1440px]"} ${
          scrollable
            ? "space-y-4 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:gap-4 lg:space-y-0"
            : "space-y-4"
        }`}
      >
        {children}
      </div>
    </main>
  );
}

interface PageScrollAreaProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function PageScrollArea({ children, className = "", ariaLabel }: PageScrollAreaProps) {
  return (
    <div
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      className={`min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-2 [scrollbar-gutter:stable] ${className}`}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ElementType;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  meta,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

      <div className="relative flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 sm:flex">
            <Icon size={20} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700">
              {eyebrow}
            </p>
            <h1 className="mt-0.5 text-xl font-bold tracking-[-0.025em] text-slate-950 sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">{description}</p>
            {meta && <div className="mt-1.5 text-[11px] font-medium text-slate-400">{meta}</div>}
          </div>
        </div>

        {actions && <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{actions}</div>}
      </div>
    </header>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  description?: string;
  tone?: MetricTone;
}

const metricToneClasses: Record<MetricTone, string> = {
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-100 text-slate-600",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  description,
  tone = "blue",
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            {label}
          </p>
          <strong className="mt-1 block text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </strong>
          {description && <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>}
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${metricToneClasses[tone]}`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
    </article>
  );
}

export function PageToolbar({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {children}
    </section>
  );
}
