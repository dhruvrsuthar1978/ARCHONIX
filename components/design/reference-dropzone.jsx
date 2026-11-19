'use client';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, RotateCcw, Trash2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatFileSize } from '@/lib/utils';
export function ReferenceDropzone({ onFileChange }) {
    const [file, setFile] = useState();
    const [preview, setPreview] = useState();
    const [error, setError] = useState();
    const onDrop = useCallback((accepted, rejected) => {
        const nextFile = accepted[0];
        if (nextFile) {
            setFile(nextFile);
            setError(undefined);
            onFileChange(nextFile);
            return;
        }
        const reason = rejected[0]?.errors[0]?.code;
        setError(reason === 'file-too-large' ? 'Files must be smaller than 10MB.' : 'Use a PNG, JPG, or PDF reference.');
    }, [onFileChange]);
    const dropzone = useDropzone({ onDrop, accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'application/pdf': ['.pdf'] }, maxSize: 10 * 1024 * 1024, multiple: false });
    useEffect(() => {
        if (!file || file.type === 'application/pdf') {
            setPreview(undefined);
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);
    const clear = () => { setFile(undefined); setPreview(undefined); setError(undefined); onFileChange(undefined); };
    return <div className="space-y-2"><div {...dropzone.getRootProps()} className={cn('group cursor-pointer rounded-xl border border-dashed p-5 transition-colors focus-within:ring-2 focus-within:ring-blueprint-cyan/60', dropzone.isDragActive ? 'border-blueprint-cyan bg-blueprint-cyan/10' : 'border-slate-700 bg-slate-950/30 hover:border-slate-600 hover:bg-slate-900/60')}><input {...dropzone.getInputProps()} aria-label="Upload a design reference"/>{!file ? <div className="flex items-center gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blueprint-cyan/10 text-blueprint-cyan"><UploadCloud className="size-5"/></span><div><p className="text-sm font-medium text-slate-200">{dropzone.isDragActive ? 'Drop your reference here' : 'Drag and drop a reference'}</p><p className="mt-1 text-xs text-slate-500">PNG, JPG, or PDF · 10MB max · optional</p></div></div> : <div className="flex items-center gap-3"><div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-800">{preview ? <img src={preview} alt="Reference preview" className="size-full object-cover"/> : <FileText className="size-5 text-blueprint-cyan"/>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-200">{file.name}</p><p className="mt-1 font-data text-[10px] text-slate-500">{formatFileSize(file.size)} · Selected</p></div><span className="font-data text-[10px] text-blueprint-success">Attached</span></div>}</div>{error ? <div className="flex items-center justify-between gap-3 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-blueprint-danger" role="alert"><span>{error}</span><Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg px-2 text-xs text-blueprint-danger" onClick={clear}><RotateCcw className="size-3.5"/> Retry</Button></div> : null}{file ? <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg px-2 text-xs text-slate-500 hover:bg-slate-800 hover:text-red-300" onClick={clear}><Trash2 className="size-3.5"/> Remove reference</Button> : null}</div>;
}
