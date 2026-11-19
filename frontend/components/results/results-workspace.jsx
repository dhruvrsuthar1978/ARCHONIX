'use client';
import { useEffect, useState } from 'react';
import Link from '@/components/shared/link';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { CadViewer } from '@/components/cad/cad-viewer';
import { ExportActions } from '@/components/results/export-actions';
import { SpecificationLedger } from '@/components/results/specification-ledger';
import { PageHeading } from '@/components/shared/page-heading';
import { Button } from '@/components/ui/button';
import { CadPipelineError, postCadPipeline } from '@/lib/cad/client';
const initialDrawingRequests = new Map();
function loadInitialDrawing(projectId) {
    const pending = initialDrawingRequests.get(projectId);
    if (pending)
        return pending;
    const request = postCadPipeline('/api/cad/rerender', projectId)
        .catch((error) => {
        if (error instanceof CadPipelineError && error.statusCode === 404) {
            return postCadPipeline('/api/cad/generate', projectId);
        }
        throw error;
    });
    initialDrawingRequests.set(projectId, request);
    request.then(() => {
        if (initialDrawingRequests.get(projectId) === request)
            initialDrawingRequests.delete(projectId);
    }, () => {
        if (initialDrawingRequests.get(projectId) === request)
            initialDrawingRequests.delete(projectId);
    });
    return request;
}
export function ResultsWorkspace() {
    const { id } = useParams();
    const [drawing, setDrawing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previewError, setPreviewError] = useState();
    const [validationErrors, setValidationErrors] = useState([]);
    const [warnings, setWarnings] = useState([]);
    const [isRerendering, setIsRerendering] = useState(false);
    useEffect(() => {
        let active = true;
        loadInitialDrawing(id)
            .then((result) => {
            if (active) {
                setDrawing(result);
                setWarnings(result.warnings);
                setValidationErrors([]);
                setPreviewError(undefined);
            }
        })
            .catch((error) => {
            const message = error instanceof Error ? error.message : 'CAD generation failed.';
            if (active) {
                setPreviewError(message);
                if (error instanceof CadPipelineError) {
                    setValidationErrors(error.errors);
                    setWarnings(error.warnings);
                }
                toast.error(message);
            }
        })
            .finally(() => {
            if (active)
                setIsLoading(false);
        });
        return () => {
            active = false;
        };
    }, [id]);
    async function rerenderSavedSpec() {
        setIsRerendering(true);
        try {
            const result = await postCadPipeline('/api/cad/rerender', id);
            setDrawing(result);
            setWarnings(result.warnings);
            setValidationErrors([]);
            setPreviewError(undefined);
            toast.success('Drawing re-rendered from the saved specification.');
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Re-render failed.';
            if (error instanceof CadPipelineError) {
                setValidationErrors(error.errors);
                setWarnings(error.warnings);
            }
            toast.error(message);
        }
        finally {
            setIsRerendering(false);
        }
    }
    return (<div className="mx-auto max-w-[1800px] space-y-6">
      <PageHeading eyebrow={`Design results / ${id}`} title={drawing?.project_name ?? 'Generated design preview'} description="Review the dimensioned drawing and design inputs. Zoom in for callouts and schedule details." action={<Button asChild variant="outline" className="h-10 rounded-lg border-slate-700 bg-transparent text-xs text-slate-300 hover:bg-slate-800">
            <Link href="/history"><ArrowLeft className="size-3.5"/> Back to history</Link>
          </Button>}/>

      <section aria-label="Generated CAD drawing" className="space-y-4">
        {previewError || validationErrors.length > 0 || warnings.length > 0 ? (<aside role={validationErrors.length > 0 || previewError ? 'alert' : 'status'} className={validationErrors.length > 0 || previewError
                ? 'rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-4'
                : 'rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4'}>
            <p className="text-sm font-semibold text-slate-100">
              {validationErrors.length > 0 ? 'Specification validation failed' : previewError ? 'Drawing generation needs attention' : 'Drawing review warnings'}
            </p>
            {previewError ? <p className="mt-1 text-sm text-slate-300">{previewError}</p> : null}
            {[...validationErrors, ...warnings].length > 0 ? (<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {[...validationErrors, ...warnings].map((warning) => <li key={warning}>{warning}</li>)}
              </ul>) : null}
          </aside>) : null}
        <CadViewer previewSvg={drawing?.preview_svg ?? null} isLoading={isLoading} error={previewError}/>
        {drawing ? (<div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">Preliminary schematic generated</p>
              <p className="mt-1 text-xs text-slate-500">
                {drawing.width_mm} × {drawing.height_mm} mm · {drawing.section_mm} mm frame section
              </p>
            </div>
            <ExportActions projectId={id} specification={drawing.spec} isRerendering={isRerendering} onRerender={() => void rerenderSavedSpec()}/>
          </div>) : null}
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SpecificationLedger specification={drawing}/>
        <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="font-data text-[10px] uppercase tracking-[0.16em] text-amber-300">Review before fabrication</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This is a dimensioned schematic preview, not a certified construction or fire-rating detail.
            Confirm the opening, handing, hardware, fixings, and applicable standards with the project team.
          </p>
        </section>
      </div>
    </div>);
}
