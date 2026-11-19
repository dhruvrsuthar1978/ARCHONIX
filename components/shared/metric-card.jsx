import { cn } from '@/lib/utils';
export function MetricCard({ label, value, change, icon: Icon, tone = 'blue' }) {
    const tones = { blue: 'bg-blue-500/10 text-blue-300', cyan: 'bg-cyan-400/10 text-cyan-300', green: 'bg-emerald-400/10 text-emerald-300', violet: 'bg-violet-400/10 text-violet-300' };
    return <div className="rounded-xl border border-slate-800 bg-slate-900/55 p-4 shadow-sm shadow-slate-950/10 transition-transform hover:-translate-y-0.5 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</p></div><span className={cn('flex size-9 items-center justify-center rounded-lg', tones[tone])}><Icon className="size-4"/></span></div><p className="mt-4 font-data text-[10px] text-blueprint-success">{change}</p></div>;
}
