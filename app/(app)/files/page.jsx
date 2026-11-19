import { FileBox } from 'lucide-react'

import { FileCard } from '@/components/files/file-card'
import { PageHeading } from '@/components/shared/page-heading'
import { useGeneratedFiles } from '@/hooks/use-workspace-data'

export default function FilesPage() {
  const { data: files = [], isLoading, isError } = useGeneratedFiles()

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <PageHeading
        eyebrow="Workspace / deliverables"
        title="Generated files"
        description="Production-ready files from your completed design jobs."
        action={<div className="flex items-center gap-2 text-xs text-slate-500"><FileBox className="size-4 text-blueprint-cyan" /> {files.length} ready</div>}
      />
      {isLoading ? <p className="py-12 text-center text-sm text-slate-500">Loading your files…</p> : null}
      {isError ? <p role="alert" className="py-12 text-center text-sm text-blueprint-danger">Your files could not be loaded.</p> : null}
      {!isLoading && !isError && files.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">CAD exports will appear here after you generate a design.</p>
      ) : null}
      {!isLoading && !isError && files.length > 0 ? (
        <div className="space-y-3">{files.map((file) => <FileCard key={file.id} file={file} />)}</div>
      ) : null}
    </div>
  )
}
