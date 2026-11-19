import { cn } from '@/lib/utils';
export function StatusBadge({ status }) {
    const config = {
        ready: { label: 'Ready', className: 'border-blueprint-success/30 bg-blueprint-success/10 text-blueprint-success' },
        processing: { label: 'Processing', className: 'border-blueprint-cyan/30 bg-blueprint-cyan/10 text-blueprint-cyan' },
        queued: { label: 'Queued', className: 'border-blueprint-warning/30 bg-blueprint-warning/10 text-blueprint-warning' },
        failed: { label: 'Failed', className: 'border-blueprint-danger/30 bg-blueprint-danger/10 text-blueprint-danger' },
        draft: { label: 'Draft', className: 'border-slate-600 bg-slate-800/80 text-slate-400' },
        cancelled: { label: 'Cancelled', className: 'border-slate-600 bg-slate-800/80 text-slate-400' },
    };
    const item = config[status] ?? config.draft;
    return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium', item.className)}><span className="size-1.5 rounded-full bg-current"/>{item.label}</span>;
}
