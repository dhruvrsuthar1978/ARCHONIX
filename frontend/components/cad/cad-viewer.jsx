'use client';
import { Box, Layers3, Loader2, Maximize2, Minimize2, Move, Rotate3d, ZoomIn, ZoomOut } from 'lucide-react';
import { useRef, useState } from 'react';
import { CadScene } from '@/components/cad/cad-scene';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
const toolbarButton = 'size-8 rounded-md text-slate-300 hover:bg-slate-800 hover:text-white';
export function CadViewer({ previewSvg, isLoading = false, error, }) {
    const sceneRef = useRef(null);
    const viewportRef = useRef(null);
    const dragRef = useRef(null);
    const [mode, setMode] = useState('solid');
    const [spinning, setSpinning] = useState(false);
    const [previewZoom, setPreviewZoom] = useState(1);
    const [expanded, setExpanded] = useState(false);
    const [panMode, setPanMode] = useState(false);
    function fitDrawing() {
        setPreviewZoom(1);
        viewportRef.current?.scrollTo({ left: 0, top: 0 });
    }
    return (<Card className={expanded
            ? 'fixed inset-3 z-50 rounded-xl border-slate-700 bg-slate-900 py-0 shadow-2xl'
            : 'rounded-xl border-slate-800 bg-slate-900/60 py-0 shadow-none'}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
        <div>
          <p className="font-data text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {previewSvg ? 'Drawing sheet / SVG preview' : 'Reference model'}
          </p>
          <CardTitle className="mt-2 text-base text-slate-100">
            {previewSvg ? 'Labeled technical drawing' : 'Interactive reference model'}
          </CardTitle>
        </div>
        {!previewSvg && !isLoading && !error ? (<Tabs value={mode} onValueChange={(value) => setMode(value)}>
            <TabsList className="h-8 rounded-lg border border-slate-800 bg-slate-950/60 p-0.5">
              <TabsTrigger value="solid" className="h-7 rounded-md px-3 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                Shaded
              </TabsTrigger>
              <TabsTrigger value="wireframe" className="h-7 rounded-lg px-3 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100">
                Wireframe
              </TabsTrigger>
            </TabsList>
          </Tabs>) : null}
      </CardHeader>

      <CardContent className={expanded
            ? 'relative h-[calc(100vh-92px)] overflow-hidden p-0'
            : 'relative h-[78vh] min-h-[560px] max-h-[950px] overflow-hidden p-0'}>
        {previewSvg ? (<div ref={viewportRef} className={panMode ? 'relative h-full cursor-grab overflow-auto bg-white active:cursor-grabbing' : 'relative h-full overflow-auto bg-white'} onPointerDown={(event) => {
                if (!panMode || (event.target instanceof HTMLElement && event.target.closest('button')))
                    return;
                const viewport = viewportRef.current;
                if (!viewport)
                    return;
                dragRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
                viewport.setPointerCapture(event.pointerId);
            }} onPointerMove={(event) => {
                const drag = dragRef.current;
                const viewport = viewportRef.current;
                if (!drag || !viewport)
                    return;
                viewport.scrollLeft = drag.left - (event.clientX - drag.x);
                viewport.scrollTop = drag.top - (event.clientY - drag.y);
            }} onPointerUp={(event) => {
                dragRef.current = null;
                if (viewportRef.current?.hasPointerCapture(event.pointerId)) {
                    viewportRef.current.releasePointerCapture(event.pointerId);
                }
            }} onPointerCancel={() => { dragRef.current = null; }}>
            <div className="absolute right-3 top-3 z-10 flex gap-1 rounded-md border border-slate-300 bg-white/95 p-1 text-slate-700 shadow">
              <Button variant="ghost" size="icon" className="size-8 text-slate-700 hover:bg-slate-100" onClick={() => setPreviewZoom((zoom) => Math.max(0.5, zoom - 0.25))} aria-label="Zoom out drawing">
                <ZoomOut className="size-4"/>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-slate-700 hover:bg-slate-100" onClick={fitDrawing} aria-label="Fit drawing to view">
                <Maximize2 className="size-4"/>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-slate-700 hover:bg-slate-100" onClick={() => setPreviewZoom((zoom) => Math.min(3, zoom + 0.25))} aria-label="Zoom in drawing">
                <ZoomIn className="size-4"/>
              </Button>
              <Button variant="ghost" size="icon" className={panMode ? 'size-8 bg-slate-100 text-blue-700' : 'size-8 text-slate-700 hover:bg-slate-100'} onClick={() => setPanMode((value) => !value)} aria-label={panMode ? 'Disable pan mode' : 'Enable pan mode'} aria-pressed={panMode}>
                <Move className="size-4"/>
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-slate-700 hover:bg-slate-100" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? 'Close full-screen drawing' : 'Expand drawing'}>
                {expanded ? <Minimize2 className="size-4"/> : <Maximize2 className="size-4"/>}
              </Button>
            </div>
            {panMode ? <span className="absolute bottom-3 left-3 z-10 rounded bg-white/90 px-2 py-1 text-xs text-slate-600 shadow">Drag to pan</span> : null}
            <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(previewSvg)}`} alt="Generated labeled CAD shop drawing" className="mx-auto block max-w-none" draggable={false} style={{ height: `${previewZoom * 100}%`, width: 'auto' }}/>
          </div>) : isLoading ? (<div className="flex h-full items-center justify-center gap-3 text-sm text-slate-400">
            <Loader2 className="size-5 animate-spin text-blueprint-cyan"/>
            Generating drawing preview…
          </div>) : error ? (<div className="flex h-full items-center justify-center px-8 text-center text-sm text-blueprint-danger">
            {error}
          </div>) : (<CadScene ref={sceneRef} wireframe={mode === 'wireframe'} spinning={spinning}/>)}

        {!previewSvg && !isLoading && !error ? (<>
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-950/80 p-1 shadow-xl backdrop-blur">
              <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => sceneRef.current?.zoomIn()} aria-label="Zoom in">
                <ZoomIn className="size-3.5"/>
              </Button>
              <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => sceneRef.current?.zoomOut()} aria-label="Zoom out">
                <ZoomOut className="size-3.5"/>
              </Button>
              <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => sceneRef.current?.fit()} aria-label="Fit model to view">
                <Maximize2 className="size-3.5"/>
              </Button>
            </div>

            <p className="absolute right-4 top-4 font-data text-[10px] uppercase tracking-[0.14em] text-slate-500">Drag to orbit</p>

            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/80 bg-slate-950/80 px-3 py-2 backdrop-blur">
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="text-slate-500">Sample geometry · not project-specific</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => setSpinning((current) => !current)} aria-label="Rotate model" aria-pressed={spinning}>
                  <Rotate3d className={spinning ? 'size-3.5 text-blueprint-cyan' : 'size-3.5'}/>
                </Button>
                <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => setMode(mode === 'solid' ? 'wireframe' : 'solid')} aria-label="Toggle layer wireframe" aria-pressed={mode === 'wireframe'}>
                  <Layers3 className="size-3.5"/>
                </Button>
                <Button variant="ghost" size="icon" className={toolbarButton} onClick={() => sceneRef.current?.fit()} aria-label="Reset view">
                  <Box className="size-3.5"/>
                </Button>
              </div>
            </div>
          </>) : null}
      </CardContent>
    </Card>);
}
