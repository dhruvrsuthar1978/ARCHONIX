import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
function displayLabel(value) {
    return value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
export function SpecificationLedger({ specification }) {
    const rows = specification
        ? [
            ['Overall size', `${specification.width_mm} × ${specification.height_mm} mm`],
            ['Frame section', `${specification.section_mm} mm`],
            ...(specification.spec ? [
                ['Door type', `${displayLabel(specification.spec.door_type)} / ${specification.spec.leaf_count} leaf${specification.spec.leaf_count === 1 ? '' : 's'}`],
                ['Leaf thickness', `${specification.spec.leaf_thickness_mm} mm`],
                ['Hinges', `${specification.spec.hinges.count} per leaf`],
                ['Lock / handle', `${displayLabel(specification.spec.lock_handle.stile_side)} stile / ${specification.spec.lock_handle.height_mm} mm AFF`],
                ['Glazing', specification.spec.glazing.included ? `${specification.spec.glazing.pane_count} pane(s)` : 'None'],
            ] : []),
            ['Material', displayLabel(specification.material)],
            ['Finish', displayLabel(specification.finish)],
            ['Drawing type', 'Door / frame arrangement'],
            ['Scale / units', 'NTS / mm'],
        ]
        : [];
    return (<Card className="rounded-xl border-slate-800 bg-slate-900/55 py-0 shadow-none">
      <CardHeader className="border-b border-slate-800 px-5 py-5">
        <p className="font-data text-[10px] uppercase tracking-[0.16em] text-slate-500">Drawing specification</p>
        <CardTitle className="mt-2 text-base text-white">Design inputs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {specification ? (<dl className="divide-y divide-slate-800/80">
            {rows.map(([label, value]) => (<div key={label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <dt className="text-xs text-slate-500">{label}</dt>
                <dd className="text-right font-data text-[11px] text-slate-200">{value}</dd>
              </div>))}
          </dl>) : (<p className="px-5 py-4 text-xs text-slate-500">Specifications will appear when the preview is generated.</p>)}
      </CardContent>
    </Card>);
}
