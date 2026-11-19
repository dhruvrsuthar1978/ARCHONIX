'use client';
import { Clipboard, Download, FileCode2, FileText, Loader2, RotateCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage } from '@/lib/api';
async function downloadErrorMessage(error) {
    if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
            const body = JSON.parse(await error.response.data.text());
            if (typeof body === 'object' && body !== null && 'detail' in body && typeof body.detail === 'string') {
                return body.detail;
            }
        }
        catch {
            return getApiErrorMessage(error);
        }
    }
    return getApiErrorMessage(error);
}
export function ExportActions({ projectId, specification, isRerendering, onRerender, }) {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(null);
    async function download(format) {
        setDownloading(format);
        try {
            const { data } = await api.get(`/api/projects/${projectId}/cad-artifacts/${format}`, { responseType: 'blob' });
            const objectUrl = URL.createObjectURL(data);
            const anchor = document.createElement('a');
            anchor.href = objectUrl;
            anchor.download = `drawing.${format}`;
            anchor.click();
            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        }
        catch (error) {
            toast.error(await downloadErrorMessage(error));
        }
        finally {
            setDownloading(null);
        }
    }
    async function copySpecification() {
        try {
            await navigator.clipboard.writeText(JSON.stringify(specification, null, 2));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        }
        catch {
            toast.error('Unable to copy the specification.');
        }
    }
    const buttonClass = 'h-10 rounded-lg border-slate-700 bg-transparent text-xs text-slate-200 hover:bg-slate-800';
    return (<div className="flex flex-wrap items-center gap-2">
      <Button disabled={downloading !== null} onClick={() => void download('svg')} className="h-10 rounded-lg bg-blueprint-accent text-xs text-white hover:bg-blue-500">
        {downloading === 'svg' ? <Loader2 className="size-3.5 animate-spin"/> : <FileCode2 className="size-3.5"/>} SVG
      </Button>
      <Button disabled={downloading !== null} variant="outline" className={buttonClass} onClick={() => void download('pdf')}>
        {downloading === 'pdf' ? <Loader2 className="size-3.5 animate-spin"/> : <FileText className="size-3.5"/>} PDF
      </Button>
      <Button disabled={downloading !== null} variant="outline" className={buttonClass} onClick={() => void download('dxf')}>
        {downloading === 'dxf' ? <Loader2 className="size-3.5 animate-spin"/> : <Download className="size-3.5"/>} DXF
      </Button>
      <Button disabled={isRerendering} variant="outline" className={buttonClass} onClick={onRerender}>
        {isRerendering ? <Loader2 className="size-3.5 animate-spin"/> : <RotateCw className="size-3.5"/>} Re-render saved spec
      </Button>
      <Button variant="ghost" className="h-10 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => void copySpecification()}>
        <Clipboard className="size-3.5"/> {copied ? 'Copied' : 'Copy spec'}
      </Button>
    </div>);
}
