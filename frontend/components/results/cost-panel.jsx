import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { CircleDollarSign } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'

const colors = ['#38bdf8', '#2563eb', '#818cf8', '#64748b']

export function CostPanel({ estimate }) {
  const slices = estimate ? [
    { name: 'Material', value: estimate.material_cost },
    { name: 'Finish', value: estimate.finish_cost },
    { name: 'Labor', value: estimate.labor_cost },
    { name: 'Overhead', value: estimate.overhead ?? 0 },
  ] : []

  return (
    <Card className="rounded-xl border-slate-800 bg-slate-900/55 py-0 shadow-none">
      <CardHeader className="border-b border-slate-800 px-5 py-5">
        <p className="font-data text-[10px] uppercase tracking-[0.16em] text-slate-500">Estimate / INR</p>
        <CardTitle className="mt-2 flex items-center gap-2 text-base text-white"><CircleDollarSign className="size-4 text-blueprint-cyan"/> Cost estimation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 p-5">
        {!estimate ? <p className="py-8 text-center text-xs text-slate-500">A project with dimensions is needed for an estimate.</p> : <>
          <div>
            <p className="text-xs text-slate-500">Total with GST</p>
            <p className="mt-1 font-data text-3xl font-semibold text-white">{formatINR(estimate.total_cost)}</p>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="value" nameKey="name" innerRadius={44} outerRadius={66} paddingAngle={3} stroke="none">
                  {slices.map((slice, index) => <Cell key={slice.name} fill={colors[index]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#f8fafc', fontSize: 11 }} formatter={(value) => formatINR(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {slices.map((slice, index) => <div key={slice.name} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-slate-400"><span className="size-2 rounded-full" style={{ backgroundColor: colors[index] }}/>{slice.name}</span>
              <span className="font-data text-slate-200">{formatINR(slice.value)}</span>
            </div>)}
            <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-xs">
              <span className="text-slate-400">GST</span><span className="font-data text-slate-200">{formatINR(estimate.gst ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-700 pt-3 text-sm font-semibold">
              <span className="text-white">Total</span><span className="font-data text-blueprint-cyan">{formatINR(estimate.total_cost)}</span>
            </div>
          </div>
        </>}
      </CardContent>
    </Card>
  )
}
