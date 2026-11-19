import { AlertCircle, Check, CircleDashed } from 'lucide-react'
import { useParams } from 'react-router-dom'

import Link from '@/components/shared/link'
import { PageHeading } from '@/components/shared/page-heading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useProjects } from '@/hooks/use-workspace-data'

export function ProcessingTimeline() {
  const { id } = useParams()
  const { data: projects = [], isLoading, isError } = useProjects()
  const project = projects.find((item) => item.id === id)
  const hasExports = (project?.generatedFileCount ?? 0) > 0

  if (isLoading) return <p className="py-16 text-center text-sm text-slate-500">Loading project status…</p>
  if (isError) return <p role="alert" className="py-16 text-center text-sm text-blueprint-danger">Project status could not be loaded.</p>
  if (!project) return <p role="alert" className="py-16 text-center text-sm text-slate-400">This project was not found in your account.</p>

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <PageHeading
        eyebrow="Generation / project status"
        title={project.name}
        description={hasExports ? 'CAD exports have been generated for this project.' : 'There is no background job running for this project.'}
        action={<Button asChild className="h-9 rounded-lg bg-blueprint-accent text-xs text-white hover:bg-blue-500"><Link href={`/designs/${project.id}/results`}>Open results</Link></Button>}
      />
      <Card className="rounded-xl border-slate-800 bg-slate-900/55 py-0 shadow-none">
        <CardContent className="flex items-start gap-4 p-6">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${hasExports ? 'bg-blueprint-success/10 text-blueprint-success' : 'bg-slate-800 text-slate-400'}`}>
            {hasExports ? <Check className="size-5"/> : project.status === 'failed' ? <AlertCircle className="size-5"/> : <CircleDashed className="size-5"/>}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-200">{hasExports ? 'Exports ready' : project.status === 'failed' ? 'Generation failed' : 'Ready to generate'}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {hasExports ? `${project.generatedFileCount} CAD files are saved in your account.` : 'Generation runs from the project results page. Open it to start or retry CAD generation.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
