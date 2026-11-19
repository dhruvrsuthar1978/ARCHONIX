import Link from '@/components/shared/link';
import { ArrowRight, Box, Check, Command, Layers3, Play, Sparkles, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
const featureRows = [
    { icon: Sparkles, title: 'Natural-language specs', copy: 'Describe the outcome, constraints, and material intent in the language your team already uses.' },
    { icon: Workflow, title: 'Traceable AI workflow', copy: 'See dimensions, validation, cost, and CAD generation progress as each agent completes its work.' },
    { icon: Layers3, title: 'Production-ready outputs', copy: 'Download DXF, STEP, SVG, and PDF deliverables from one reviewable source of truth.' },
];
export default function LandingPage() {
    const currentYear = new Date().getFullYear();
    return (<main className="blueprint-glow min-h-svh overflow-x-clip">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
          <span className="flex size-9 items-center justify-center rounded-xl border border-blueprint-cyan/40 bg-blueprint-cyan/10 text-blueprint-cyan"><Box className="size-4"/></span>
          <span>FORM<span className="text-blueprint-cyan">&#47;&#47;</span>CAD</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex" aria-label="Marketing">
          <a href="#workflow" className="transition-colors hover:text-white">Workflow</a>
          <a href="#features" className="transition-colors hover:text-white">Capabilities</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
        </nav>
        <div className="flex items-center gap-2"><Button asChild variant="ghost" className="hidden text-slate-300 hover:bg-white/5 hover:text-white sm:inline-flex"><Link href="/login">Sign in</Link></Button><Button asChild className="bg-blueprint-accent text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500"><Link href="/dashboard">Open workspace <ArrowRight className="size-4"/></Link></Button></div>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-16 px-5 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-px bg-gradient-to-r from-transparent via-blueprint-cyan/40 to-transparent"/>
        <div className="relative z-10">
          <Badge className="rounded-full border border-blueprint-cyan/30 bg-blueprint-cyan/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-blueprint-cyan hover:bg-blueprint-cyan/10">AI-native CAD generation</Badge>
          <h1 className="mt-7 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">Generate CAD from <span className="text-blueprint-cyan">natural language.</span></h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">From a design brief to a production-ready file set. Form//CAD turns intent into geometry, validates constraints, and makes every assumption visible.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button asChild size="lg" className="h-12 rounded-xl bg-blueprint-accent px-5 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"><Link href="/designs/new">Generate CAD From Natural Language <ArrowRight className="size-4"/></Link></Button><Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800"><a href="#workflow"><Play className="size-4 text-blueprint-cyan"/> See how it works</a></Button></div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500"><span className="flex items-center gap-2"><Check className="size-3.5 text-blueprint-success"/> Constraint-aware</span><span className="flex items-center gap-2"><Check className="size-3.5 text-blueprint-success"/> DXF / STEP / SVG</span><span className="flex items-center gap-2"><Check className="size-3.5 text-blueprint-success"/> Reviewable costs</span></div>
        </div>
        <div className="relative z-10">
          <div className="blueprint-grid relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/60 p-3 shadow-2xl shadow-blue-950/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.13),transparent_40%)]"/>
            <div className="relative rounded-xl border border-slate-700 bg-[#0b1220]/90 p-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4"><div className="flex items-center gap-2 text-xs font-medium text-slate-300"><Command className="size-4 text-blueprint-cyan"/> New design brief</div><span className="font-data text-[10px] text-slate-500">DRAFT / 01</span></div>
              <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"><p className="font-data text-[10px] uppercase tracking-[0.16em] text-blueprint-cyan">Describe your design</p><p className="mt-3 max-w-sm text-lg leading-7 text-slate-200">Main door frame · red meranti · 1200 × 2400 mm · HDHMR finish</p><div className="mt-5 flex items-center justify-between"><span className="font-data text-[10px] text-slate-500">74 / 2,000 characters</span><span className="flex size-8 items-center justify-center rounded-lg bg-blueprint-accent text-white"><ArrowRight className="size-4"/></span></div></div>
              <div className="mt-4 grid grid-cols-3 gap-2"><div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3"><p className="text-[10px] text-slate-500">Material</p><p className="mt-2 text-xs text-slate-200">Red Meranti</p></div><div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3"><p className="text-[10px] text-slate-500">Output</p><p className="mt-2 text-xs text-slate-200">DXF + STEP</p></div><div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3"><p className="text-[10px] text-slate-500">Confidence</p><p className="mt-2 font-data text-xs text-blueprint-cyan">94%</p></div></div>
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3"><span className="flex size-8 items-center justify-center rounded-lg bg-blueprint-success/10 text-blueprint-success"><Workflow className="size-4"/></span><div><p className="text-xs font-medium text-slate-200">Validation queued</p><p className="mt-1 font-data text-[10px] text-slate-500">4 agents ready to run</p></div><span className="ml-auto size-2 animate-pulse rounded-full bg-blueprint-cyan"/></div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl scroll-mt-10 px-5 pb-24 lg:px-8"><div className="border-y border-slate-800 py-6"><div className="flex flex-wrap items-center justify-between gap-4"><p className="font-data text-[11px] uppercase tracking-[0.2em] text-slate-500">One traceable workflow</p><p className="font-data text-[11px] text-blueprint-cyan">Brief → constraints → cost → CAD</p></div><div className="mt-6 grid gap-3 md:grid-cols-5">{['Brief', 'Dimensions', 'Validation', 'Costing', 'CAD export'].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3"><span className={`flex size-7 items-center justify-center rounded-lg font-data text-[10px] ${index === 2 ? 'bg-blueprint-cyan text-slate-950' : 'bg-slate-800 text-slate-400'}`}>0{index + 1}</span><span className="text-xs text-slate-300">{step}</span></div>)}</div></div></section>

      <section id="features" className="mx-auto grid max-w-7xl gap-12 px-5 pb-28 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><p className="font-data text-[11px] uppercase tracking-[0.2em] text-blueprint-cyan">Built for production decisions</p><h2 className="mt-5 max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">Less handoff. More confidence in every dimension.</h2><p className="mt-5 max-w-md text-sm leading-6 text-slate-400">Keep the design conversation, validation evidence, cost model, and files in one reviewable workspace.</p></div><div className="divide-y divide-slate-800 border-y border-slate-800">{featureRows.map(({ icon: Icon, title, copy }, index) => <div key={title} className="flex gap-5 py-6"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-blueprint-cyan"><Icon className="size-4"/></span><div><p className="text-sm font-medium text-white">{String(index + 1).padStart(2, '0')} / {title}</p><p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">{copy}</p></div></div>)}</div></section>

      <section id="pricing" className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"><div className="rounded-2xl border border-blue-500/25 bg-blue-500/10 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between"><div><p className="font-data text-[11px] uppercase tracking-[0.2em] text-blueprint-cyan">Start with one brief</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Turn your next concept into a buildable baseline.</h2></div><Button asChild size="lg" className="mt-6 h-11 rounded-xl bg-blueprint-accent text-white hover:bg-blue-500 lg:mt-0"><Link href="/designs/new">Open the workspace <ArrowRight className="size-4"/></Link></Button></div></section>
      <footer className="border-t border-slate-800 px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© {currentYear} Form//CAD</span><span className="font-data">Design intent → production-ready geometry</span></div></footer>
    </main>);
}
