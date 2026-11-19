import { ArrowRight, CircleDollarSign } from 'lucide-react'

import { CostPanel } from '@/components/results/cost-panel'
import { PageHeading } from '@/components/shared/page-heading'
import Link from '@/components/shared/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCostEstimates } from '@/hooks/use-workspace-data'
import { formatINR } from '@/lib/utils'

export default function CostEstimatesPage() {
  const { data: estimates = [], isLoading, isError } = useCostEstimates()
  const totalCost = estimates.reduce((total, item) => total + item.estimate.total_cost, 0)
  const materialCost = estimates.reduce((total, item) => total + item.estimate.material_cost, 0)
  const costComponents = estimates.reduce((total, item) => total
    + item.estimate.material_cost
    + item.estimate.finish_cost
    + item.estimate.labor_cost
    + (item.estimate.overhead ?? 0), 0)
  const materialShare = costComponents ? `${Math.round((materialCost / costComponents) * 100)}%` : '—'
  const selectedEstimate = estimates[0]

  return (
    <div className="mx-auto max-w-[1180px] space-y-7">
      <PageHeading
        eyebrow="Workspace / costing"
        title="Cost estimates"
        description="Estimates use each saved project's dimensions, material, and finish."
        action={<Button asChild className="h-10 rounded-lg bg-blueprint-accent text-xs text-white hover:bg-blue-500"><Link href="/designs/new">Estimate a new design <ArrowRight className="size-3.5"/></Link></Button>}
      />
      {isError ? <p role="alert" className="text-sm text-blueprint-danger">Cost estimates could not be loaded.</p> : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_310px]">
        <div className="space-y-4">
          <Card className="rounded-xl border-slate-800 bg-slate-900/55 py-0 shadow-none">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Average estimated project cost</p>
                <p className="mt-2 font-data text-2xl text-white">{isLoading ? 'Loading…' : estimates.length ? formatINR(totalCost / estimates.length) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Material share</p>
                <p className="mt-2 font-data text-2xl text-blueprint-cyan">{isLoading ? 'Loading…' : materialShare}</p>
              </div>
            </CardContent>
          </Card>
          {isLoading ? <p className="py-8 text-center text-sm text-slate-500">Loading estimates…</p> : null}
          {!isLoading && !isError && estimates.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No projects with saved dimensions are available to estimate.</p>
          ) : null}
          {!isLoading && !isError ? estimates.map((project) => (
            <div key={project.id} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/55 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blueprint-cyan"><CircleDollarSign className="size-4"/></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-200">{project.name}</p>
                <p className="mt-1 text-xs capitalize text-slate-500">{project.material} · {project.finish}</p>
              </div>
              <span className="font-data text-sm text-white">{formatINR(project.estimate.total_cost)}</span>
            </div>
          )) : null}
        </div>
        <CostPanel estimate={selectedEstimate?.estimate} />
      </div>
    </div>
  )
}
