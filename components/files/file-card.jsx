import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { api, getApiErrorMessage } from '@/lib/api'
import { formatDate, formatFileSize } from '@/lib/utils'

const formatColors = {
  DXF: 'text-blueprint-cyan bg-blueprint-cyan/10',
  SVG: 'text-blueprint-success bg-blueprint-success/10',
  PDF: 'text-rose-300 bg-rose-400/10',
}

export function FileCard({ file }) {
  const [downloading, setDownloading] = useState(false)

  async function downloadFile() {
    setDownloading(true)
    try {
      const { data } = await api.get(
        `/api/projects/${file.projectId}/cad-artifacts/${file.format.toLowerCase()}`,
        { responseType: 'blob' },
      )
      const objectUrl = URL.createObjectURL(data)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = file.name
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/55 p-4 transition-colors hover:border-slate-700 hover:bg-slate-900">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-data text-[11px] font-semibold ${formatColors[file.format] ?? 'bg-slate-800 text-slate-300'}`}>
        {file.format}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">{file.name}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{file.projectName}</p>
        <p className="mt-1 font-data text-[10px] text-slate-600">{formatFileSize(file.sizeBytes)} · {formatDate(file.createdAt)}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white"
        aria-label={`Download ${file.name}`}
        disabled={downloading}
        onClick={() => void downloadFile()}
      >
        {downloading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
      </Button>
    </div>
  )
}
