'use client';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 480;
const CENTER = [VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 6];
const BASE_UNIT = 144;
const FLOOR_Y = -1.42;
const DEFAULT_VIEW = { yaw: -0.62, pitch: 0.18, zoom: 1 };
const LIGHT = normalize([-0.45, 0.78, 0.62]);
const MATERIALS = {
    frame: [120, 144, 172],
    leaf: [146, 170, 198],
    panel: [106, 130, 156],
    hardware: [126, 231, 255],
};
function normalize([x, y, z]) {
    const magnitude = Math.hypot(x, y, z) || 1;
    return [x / magnitude, y / magnitude, z / magnitude];
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function transform([x, y, z], yaw, pitch) {
    const cosYaw = Math.cos(yaw);
    const sinYaw = Math.sin(yaw);
    const rotatedX = x * cosYaw - z * sinYaw;
    const rotatedZ = x * sinYaw + z * cosYaw;
    const cosPitch = Math.cos(pitch);
    const sinPitch = Math.sin(pitch);
    return [rotatedX, y * cosPitch - rotatedZ * sinPitch, y * sinPitch + rotatedZ * cosPitch];
}
function project(point, yaw, pitch, unit) {
    const [x, y, depth] = transform(point, yaw, pitch);
    return { x: CENTER[0] + x * unit, y: CENTER[1] - y * unit, depth };
}
function shade(material, tone) {
    const clamped = Math.min(1.18, Math.max(0.42, tone));
    const [r, g, b] = MATERIALS[material];
    const channel = (value) => Math.round(Math.min(255, value * clamped));
    return `rgb(${channel(r)} ${channel(g)} ${channel(b)})`;
}
/** A double door frame: jambs, head, threshold, two leaves with raised panels, and lever hardware. */
function doorSolids() {
    const solids = [
        { center: [-0.57, 0, 0], size: [0.11, 2.44, 0.26], material: 'frame' },
        { center: [0.57, 0, 0], size: [0.11, 2.44, 0.26], material: 'frame' },
        { center: [0, 1.165, 0], size: [1.25, 0.11, 0.26], material: 'frame' },
        { center: [0, -1.165, 0], size: [1.25, 0.11, 0.26], material: 'frame' },
    ];
    for (const leafX of [-0.245, 0.245]) {
        solids.push({ center: [leafX, 0, 0.04], size: [0.5, 2.2, 0.08], material: 'leaf' });
        for (const panelY of [0.52, -0.5]) {
            solids.push({ center: [leafX, panelY, 0.085], size: [0.32, 0.82, 0.03], material: 'panel' });
        }
    }
    solids.push({ center: [-0.13, 0.02, 0.12], size: [0.2, 0.035, 0.045], material: 'hardware' });
    solids.push({ center: [0.13, 0.02, 0.12], size: [0.2, 0.035, 0.045], material: 'hardware' });
    return solids;
}
function boxFaces({ center, size, material }) {
    const [cx, cy, cz] = center;
    const [hx, hy, hz] = [size[0] / 2, size[1] / 2, size[2] / 2];
    const corner = (sx, sy, sz) => [cx + sx * hx, cy + sy * hy, cz + sz * hz];
    const definitions = [
        [[0, 0, 1], [corner(-1, -1, 1), corner(1, -1, 1), corner(1, 1, 1), corner(-1, 1, 1)]],
        [[0, 0, -1], [corner(1, -1, -1), corner(-1, -1, -1), corner(-1, 1, -1), corner(1, 1, -1)]],
        [[1, 0, 0], [corner(1, -1, 1), corner(1, -1, -1), corner(1, 1, -1), corner(1, 1, 1)]],
        [[-1, 0, 0], [corner(-1, -1, -1), corner(-1, -1, 1), corner(-1, 1, 1), corner(-1, 1, -1)]],
        [[0, 1, 0], [corner(-1, 1, 1), corner(1, 1, 1), corner(1, 1, -1), corner(-1, 1, -1)]],
        [[0, -1, 0], [corner(-1, -1, -1), corner(1, -1, -1), corner(1, -1, 1), corner(-1, -1, 1)]],
    ];
    return definitions.map(([normal, points]) => ({ normal, points, material }));
}
export const CadScene = forwardRef(function CadScene({ wireframe = false, spinning = false }, ref) {
    const [view, setView] = useState(DEFAULT_VIEW);
    const dragOrigin = useRef(null);
    useImperativeHandle(ref, () => ({
        zoomIn: () => setView((current) => ({ ...current, zoom: Math.min(2.2, Number((current.zoom * 1.18).toFixed(3))) })),
        zoomOut: () => setView((current) => ({ ...current, zoom: Math.max(0.55, Number((current.zoom / 1.18).toFixed(3))) })),
        fit: () => setView(DEFAULT_VIEW),
    }), []);
    useEffect(() => {
        if (!spinning)
            return;
        let frame = 0;
        let previous = performance.now();
        const tick = (now) => {
            const elapsed = now - previous;
            previous = now;
            setView((current) => ({ ...current, yaw: current.yaw + elapsed * 0.00045 }));
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [spinning]);
    const unit = BASE_UNIT * view.zoom;
    const gridLines = useMemo(() => {
        const lines = [];
        const extent = 2.6;
        const step = 0.34;
        for (let offset = -extent; offset <= extent + 0.001; offset += step) {
            const alongZ = [project([offset, FLOOR_Y, -extent], view.yaw, view.pitch, unit), project([offset, FLOOR_Y, extent], view.yaw, view.pitch, unit)];
            const alongX = [project([-extent, FLOOR_Y, offset], view.yaw, view.pitch, unit), project([extent, FLOOR_Y, offset], view.yaw, view.pitch, unit)];
            lines.push(`M${alongZ[0].x.toFixed(1)} ${alongZ[0].y.toFixed(1)}L${alongZ[1].x.toFixed(1)} ${alongZ[1].y.toFixed(1)}`);
            lines.push(`M${alongX[0].x.toFixed(1)} ${alongX[0].y.toFixed(1)}L${alongX[1].x.toFixed(1)} ${alongX[1].y.toFixed(1)}`);
        }
        return lines.join(' ');
    }, [unit, view.pitch, view.yaw]);
    // Order whole parts back-to-front and cull faces pointing away from the camera.
    // Per-part ordering keeps overlapping boxes (leaves, panels, rebate) deterministic.
    const parts = useMemo(() => {
        return doorSolids()
            .map((solid, solidIndex) => {
            const faces = boxFaces(solid).reduce((visible, face, faceIndex) => {
                const normal = transform(face.normal, view.yaw, view.pitch);
                if (!wireframe && normal[2] <= 0)
                    return visible;
                const projected = face.points.map((point) => project(point, view.yaw, view.pitch, unit));
                const tone = 0.5 + 0.85 * Math.max(0, dot(normal, LIGHT));
                visible.push({
                    key: `${solid.material}-${solidIndex}-${faceIndex}`,
                    points: projected.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' '),
                    fill: wireframe ? 'none' : shade(solid.material, tone),
                    stroke: wireframe ? 'rgb(126 231 255 / 0.8)' : 'rgb(126 231 255 / 0.24)',
                    strokeWidth: wireframe ? 1 : 0.7,
                });
                return visible;
            }, []);
            return {
                key: `${solid.material}-${solidIndex}`,
                depth: transform(solid.center, view.yaw, view.pitch)[2],
                faces,
            };
        })
            .sort((a, b) => a.depth - b.depth);
    }, [unit, view.pitch, view.yaw, wireframe]);
    function handlePointerDown(event) {
        dragOrigin.current = { x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
    }
    function handlePointerMove(event) {
        if (!dragOrigin.current)
            return;
        const deltaX = event.clientX - dragOrigin.current.x;
        const deltaY = event.clientY - dragOrigin.current.y;
        dragOrigin.current = { x: event.clientX, y: event.clientY };
        setView((current) => ({
            ...current,
            yaw: current.yaw + deltaX * 0.008,
            pitch: Math.min(0.72, Math.max(-0.45, current.pitch + deltaY * 0.005)),
        }));
    }
    function handlePointerUp(event) {
        dragOrigin.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }
    return (<svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full touch-none select-none cursor-grab active:cursor-grabbing" role="img" aria-label="Interactive orbit view of the generated double door frame" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      <defs>
        <linearGradient id="cad-viewport" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1626"/>
          <stop offset="62%" stopColor="#0a1320"/>
          <stop offset="100%" stopColor="#070f1a"/>
        </linearGradient>
        <radialGradient id="cad-halo" cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#7ee7ff" stopOpacity="0.14"/>
          <stop offset="100%" stopColor="#7ee7ff" stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#cad-viewport)"/>
      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#cad-halo)"/>
      <path d={gridLines} fill="none" stroke="rgb(126 231 255 / 0.11)" strokeWidth={0.75}/>

      {parts.map((part) => (<g key={part.key}>
          {part.faces.map((face) => (<polygon key={face.key} points={face.points} fill={face.fill} stroke={face.stroke} strokeWidth={face.strokeWidth} strokeLinejoin="round"/>))}
        </g>))}
    </svg>);
});
