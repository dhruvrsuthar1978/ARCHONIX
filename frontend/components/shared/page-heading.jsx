export function PageHeading({ eyebrow, title, description, action }) {
    return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-data text-[10px] uppercase tracking-[0.18em] text-blueprint-cyan">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p> : null}</div>{action ? <div className="shrink-0">{action}</div> : null}</div>;
}
