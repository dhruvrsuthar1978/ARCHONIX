import { placeLabels } from './layout.js';
export const RENDERER_VERSION = '1.0.0';
export const SHEET_WIDTH = 1600;
export const SHEET_HEIGHT = 1100;
function printable(value) {
    return value
        .replace(/[×·•]/g, 'x')
        .replace(/[–—]/g, '-')
        .replace(/[^\x20-\x7E]/g, '?');
}
function formatNumber(value) {
    return Number(value.toFixed(2)).toString();
}
function displayText(value, maximum = 36) {
    return value.length > maximum ? `${value.slice(0, maximum - 1)}…` : value;
}
function addLine(primitives, x1, y1, x2, y2, dash = false, width = 2) {
    primitives.push({ kind: 'line', x1, y1, x2, y2, dash, width });
}
function addRect(primitives, x, y, width, height, fill = 'none', stroke_width = 2) {
    primitives.push({ kind: 'rect', x, y, width, height, fill, stroke_width });
}
function addText(primitives, x, y, value, size = 14, bold = false, anchor = 'start', color = '#111827', opacity = 1) {
    primitives.push({ kind: 'text', x, y, value, size, bold, anchor, color, opacity });
}
function addCellText(primitives, x, y, value, width, size, bold = false) {
    const maximum = Math.max(4, Math.floor(width / (size * 0.62)));
    addText(primitives, x, y, displayText(value, maximum), size, bold);
}
function wrapNote(value, maximum) {
    const words = value.split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (candidate.length > maximum && line) {
            lines.push(line);
            line = word;
        }
        else {
            line = candidate;
        }
    }
    if (line)
        lines.push(line);
    return lines;
}
export function buildDrawingModel(spec, metadata) {
    const primitives = [];
    const number = formatNumber;
    const scale = Math.min(320 / spec.overall_width_mm, 420 / spec.overall_height_mm);
    const frameWidth = spec.overall_width_mm * scale;
    const frameHeight = spec.overall_height_mm * scale;
    const frameSection = spec.frame_section_mm * scale;
    const frameX = 330 - frameWidth / 2;
    const frameY = 190;
    const leafX = frameX + frameSection;
    const leafY = frameY + frameSection;
    const leafWidth = (frameWidth - frameSection * 2) / spec.leaf_count;
    const leafHeight = frameHeight - frameSection * 2;
    const handleY = frameY + frameHeight - spec.lock_handle.height_mm * scale;
    addRect(primitives, 22, 22, 1556, 1056, 'none', 3);
    addText(primitives, 48, 62, 'DOOR / FRAME - GENERAL ARRANGEMENT', 25, true);
    addText(primitives, 1548, 58, metadata.preliminary ? 'PRELIMINARY - VERIFY BEFORE FABRICATION' : 'ISSUED DRAWING', 13, true, 'end', metadata.preliminary ? '#9f1239' : '#111827');
    addLine(primitives, 40, 82, 1560, 82);
    addText(primitives, 58, 118, '01  FRONT ELEVATION', 19, true);
    addText(primitives, 58, 145, `SCALE NTS  |  UNITS mm  |  ${spec.door_type.toUpperCase()} DOOR`, 11);
    addText(primitives, frameX + frameWidth / 2, 160, `OVERALL WIDTH ${number(spec.overall_width_mm)} mm`, 13, true, 'middle');
    addLine(primitives, frameX, 174, frameX + frameWidth, 174, false, 1);
    addLine(primitives, frameX, 168, frameX, 180, false, 1);
    addLine(primitives, frameX + frameWidth, 168, frameX + frameWidth, 180, false, 1);
    addText(primitives, 58, frameY + frameHeight / 2, `HEIGHT ${number(spec.overall_height_mm)} mm`, 12, true);
    addLine(primitives, frameX - 20, frameY, frameX - 20, frameY + frameHeight, false, 1);
    addLine(primitives, frameX - 26, frameY, frameX - 14, frameY, false, 1);
    addLine(primitives, frameX - 26, frameY + frameHeight, frameX - 14, frameY + frameHeight, false, 1);
    addRect(primitives, frameX, frameY, frameWidth, frameHeight, '#dbe4ed', 3);
    addRect(primitives, leafX, leafY, frameWidth - frameSection * 2, leafHeight, '#f8fafc', 2);
    const leaves = [];
    for (let index = 0; index < spec.leaf_count; index += 1) {
        const x = leafX + index * leafWidth;
        const inset = Math.min(frameSection * 0.75, leafWidth * 0.12);
        const oneLeaf = { x: x + (index === 0 ? 0 : 1), width: leafWidth - (index === 0 ? 1 : 0) };
        leaves.push(oneLeaf);
        addRect(primitives, oneLeaf.x, leafY, oneLeaf.width, leafHeight, '#f8fafc', 2);
        addRect(primitives, x + inset, leafY + leafHeight * 0.12, leafWidth - inset * 2, leafHeight * 0.76, 'none', 1);
        if (spec.glazing.included && spec.glazing.width_mm !== null && spec.glazing.height_mm !== null) {
            const glassWidth = Math.min(spec.glazing.width_mm * scale, leafWidth - inset * 2);
            const glassHeight = Math.min(spec.glazing.height_mm * scale, leafHeight * 0.48);
            addRect(primitives, x + (leafWidth - glassWidth) / 2, leafY + leafHeight * 0.14, glassWidth, glassHeight, '#dff4ff', 2);
        }
        const hingeX = index === 0 ? x + frameSection * 0.3 : x + leafWidth - frameSection * 0.3;
        for (const position of spec.hinges.positions_mm) {
            primitives.push({
                kind: 'rect',
                x: hingeX - 2,
                y: frameY + frameHeight - position * scale - 4,
                width: 4,
                height: 8,
                fill: '#475569',
                stroke_width: 1,
            });
        }
    }
    const handleX = spec.door_type === 'double'
        ? leafX + leafWidth
        : spec.lock_handle.stile_side === 'left' ? leafX + frameSection * 0.7 : leafX + leafWidth - frameSection * 0.7;
    primitives.push({ kind: 'circle', cx: handleX, cy: handleY, radius: 4 });
    if (spec.door_type === 'double') {
        primitives.push({ kind: 'circle', cx: handleX + 5, cy: handleY, radius: 4 });
    }
    const cutY = frameY + frameHeight * 0.52;
    addLine(primitives, frameX - 5, cutY, frameX + frameWidth + 5, cutY, true, 1);
    addText(primitives, frameX - 16, cutY - 5, 'B', 12, true, 'middle');
    addText(primitives, frameX + frameWidth + 16, cutY - 5, 'B', 12, true, 'middle');
    const headCutX = frameX + frameWidth / 2;
    addLine(primitives, headCutX, frameY - 6, headCutX, frameY + frameHeight + 6, true, 1);
    addText(primitives, headCutX, frameY - 10, 'A', 12, true, 'middle');
    addText(primitives, headCutX, frameY + frameHeight + 20, 'A', 12, true, 'middle');
    const calloutRegion = { x: 520, y: 205, width: 220, height: 390 };
    const callouts = placeLabels([
        { text: `${spec.leaf_count} DOOR LEAF${spec.leaf_count === 1 ? '' : 'S'}`, x: 536, y: 275, font_size: 12, region: calloutRegion },
        { text: `HINGES ${spec.hinges.count} / LEAF`, x: 536, y: 370, font_size: 12, region: calloutRegion },
        { text: `LOCK / HANDLE ${number(spec.lock_handle.height_mm)} AFF`, x: 536, y: 465, font_size: 11, region: calloutRegion },
    ]);
    callouts.forEach((label, index) => {
        addText(primitives, label.x, label.y, label.text, label.font_size, true);
        const targetX = index === 2 ? handleX : index === 1 ? leaves[0].x : leaves[0].x + leaves[0].width * 0.72;
        const targetY = index === 2 ? handleY : index === 1 ? frameY + frameHeight * 0.74 : frameY + frameHeight * 0.35;
        addLine(primitives, targetX, targetY, label.x - 8, label.y - 5, false, 1);
    });
    addLine(primitives, 760, 92, 760, 690, false, 1);
    addText(primitives, 790, 118, '02  HEAD / JAMB SECTION  A-A', 18, true);
    addText(primitives, 830, 158, 'HEAD', 12, true);
    addRect(primitives, 820, 178, 260, 74, '#e2e8f0', 2);
    addRect(primitives, 850, 192, 200, 30, '#dbe4ed', 2);
    addRect(primitives, 868, 222, 164, 18, '#f8fafc', 2);
    addText(primitives, 1095, 194, `FRAME ${number(spec.frame_section_mm)} mm`, 11);
    addText(primitives, 1095, 228, `LEAF ${number(spec.leaf_thickness_mm)} mm`, 11);
    addText(primitives, 830, 290, 'JAMB', 12, true);
    addRect(primitives, 820, 310, 260, 74, '#e2e8f0', 2);
    addRect(primitives, 845, 326, 46, 42, '#dbe4ed', 2);
    addRect(primitives, 891, 338, 145, 22, '#f8fafc', 2);
    addText(primitives, 1095, 335, 'WALL / FIXING', 11);
    addText(primitives, 1095, 363, 'DOOR LEAF', 11);
    addLine(primitives, 790, 412, 1538, 412);
    addText(primitives, 790, 446, '03  FRAME DETAIL  B-B', 17, true);
    addRect(primitives, 820, 470, 120, 115, '#e2e8f0', 2);
    addRect(primitives, 845, 487, 76, 80, '#dbe4ed', 2);
    addRect(primitives, 921, 508, 130, 34, '#f8fafc', 2);
    addLine(primitives, 845, 597, 921, 597, false, 1);
    addText(primitives, 883, 616, `${number(spec.frame_section_mm)} mm`, 11, true, 'middle');
    addText(primitives, 820, 644, `LEAF THICKNESS ${number(spec.leaf_thickness_mm)} mm`, 11, true);
    addText(primitives, 1110, 446, 'GENERAL NOTES', 15, true);
    addText(primitives, 1110, 470, 'DIMENSIONS IN MILLIMETRES', 10, true);
    const noteLines = spec.notes.flatMap((note, noteIndex) => wrapNote(note, 76).map((line, lineIndex) => `${lineIndex === 0 ? `${noteIndex + 1}. ` : '   '}${line}`));
    noteLines.forEach((line, index) => addText(primitives, 1110, 492 + index * 18, line, 9));
    if (noteLines.length === 0) {
        addText(primitives, 1110, 492, '1. Verify opening and handing on site.', 9);
        addText(primitives, 1110, 510, '2. Schematic; not for fabrication.', 9);
    }
    addText(primitives, 52, 710, '04  DOOR / MATERIAL SCHEDULE', 17, true);
    const schedule = { x: 50, y: 728, widths: [100, 145, 170, 170, 335], rowHeight: 40 };
    const scheduleWidth = schedule.widths.reduce((sum, width) => sum + width, 0);
    addRect(primitives, schedule.x, schedule.y, scheduleWidth, schedule.rowHeight * 2, 'none', 1);
    let columnX = schedule.x;
    const headings = ['ITEM', 'TYPE / LEAVES', 'OVERALL SIZE', 'FRAME / LEAF', 'MATERIAL / FINISH'];
    const values = [
        'D01',
        `${spec.door_type.toUpperCase()} / ${spec.leaf_count}`,
        `${number(spec.overall_width_mm)} x ${number(spec.overall_height_mm)} mm`,
        `${number(spec.frame_section_mm)} / ${number(spec.leaf_thickness_mm)} mm`,
        `${spec.material} / ${spec.finish}`,
    ];
    schedule.widths.forEach((width, index) => {
        if (index > 0)
            addLine(primitives, columnX, schedule.y, columnX, schedule.y + schedule.rowHeight * 2, false, 1);
        addCellText(primitives, columnX + 7, schedule.y + 15, headings[index], width - 12, 9, true);
        addCellText(primitives, columnX + 7, schedule.y + 34, values[index], width - 12, 9);
        columnX += width;
    });
    addLine(primitives, schedule.x, schedule.y + schedule.rowHeight, schedule.x + scheduleWidth, schedule.y + schedule.rowHeight, false, 1);
    addText(primitives, 1010, 710, '05  HARDWARE SCHEDULE', 17, true);
    const hardwareRows = [
        [`H${spec.hinges.count}`, `HINGES - ${spec.hinges.count} / LEAF`],
        ['L1', `LOCK / HANDLE - ${number(spec.lock_handle.height_mm)} mm AFF`],
        ...(spec.glazing.included ? [['G1', `GLAZING - ${spec.glazing.pane_count} PANE(S)`]] : []),
    ];
    const hardwareX = 1008;
    const hardwareY = 728;
    const hardwareWidth = 540;
    const hardwareRowHeight = 24;
    addRect(primitives, hardwareX, hardwareY, hardwareWidth, hardwareRowHeight * (hardwareRows.length + 1), 'none', 1);
    addText(primitives, hardwareX + 8, hardwareY + 16, 'REF', 9, true);
    addText(primitives, hardwareX + 70, hardwareY + 16, 'DESCRIPTION', 9, true);
    addLine(primitives, hardwareX + 56, hardwareY, hardwareX + 56, hardwareY + hardwareRowHeight * (hardwareRows.length + 1), false, 1);
    addLine(primitives, hardwareX, hardwareY + hardwareRowHeight, hardwareX + hardwareWidth, hardwareY + hardwareRowHeight, false, 1);
    hardwareRows.forEach(([reference, description], index) => {
        const rowY = hardwareY + hardwareRowHeight * (index + 1);
        addText(primitives, hardwareX + 8, rowY + 16, reference, 9);
        addText(primitives, hardwareX + 70, rowY + 16, description, 9);
        if (index < hardwareRows.length - 1) {
            addLine(primitives, hardwareX, rowY + hardwareRowHeight, hardwareX + hardwareWidth, rowY + hardwareRowHeight, false, 1);
        }
    });
    addLine(primitives, 40, 826, 1560, 826);
    addRect(primitives, 40, 838, 1520, 222, 'none', 2);
    addLine(primitives, 40, 948, 1560, 948, false, 1);
    addLine(primitives, 530, 838, 530, 1060, false, 1);
    addLine(primitives, 1040, 838, 1040, 1060, false, 1);
    addLine(primitives, 1300, 838, 1300, 1060, false, 1);
    addText(primitives, 55, 862, 'PROJECT', 9, true);
    addCellText(primitives, 55, 890, metadata.project_name, 455, 15, true);
    addText(primitives, 545, 862, 'DRAWING TITLE', 9, true);
    addText(primitives, 545, 890, 'Door / frame general arrangement', 14, true);
    addText(primitives, 1055, 862, 'SCALE / UNITS', 9, true);
    addText(primitives, 1055, 890, 'NTS / mm', 12, true);
    addText(primitives, 1315, 862, 'DATE', 9, true);
    addText(primitives, 1315, 890, metadata.drawing_date, 12, true);
    addText(primitives, 55, 975, 'DRAWN BY', 9, true);
    addText(primitives, 55, 1004, displayText(metadata.drawn_by, 34), 12, true);
    addText(primitives, 55, 1032, `MATERIAL ${displayText(spec.material, 22)} / ${displayText(spec.finish, 22)}`, 9);
    addText(primitives, 545, 975, 'LEAF / FRAME', 9, true);
    addText(primitives, 545, 1004, `${number(spec.leaf_thickness_mm)} / ${number(spec.frame_section_mm)} mm`, 12, true);
    addText(primitives, 545, 1032, metadata.preliminary ? 'PRELIMINARY - NOT CERTIFIED FOR CONSTRUCTION' : 'ISSUED FOR REVIEW', 9, true, 'start', metadata.preliminary ? '#9f1239' : '#111827');
    addText(primitives, 1055, 975, 'REVISION', 9, true);
    addText(primitives, 1055, 1004, metadata.revision, 12, true);
    addText(primitives, 1315, 975, 'SHEET', 9, true);
    addText(primitives, 1315, 1004, metadata.sheet_number, 12, true);
    return { spec, metadata, primitives };
}
function escapeXml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
export function renderSvg(model) {
    const elements = model.primitives.map((primitive) => {
        if (primitive.kind === 'line') {
            return `<line x1="${formatNumber(primitive.x1)}" y1="${formatNumber(primitive.y1)}" x2="${formatNumber(primitive.x2)}" y2="${formatNumber(primitive.y2)}" stroke="#111827" stroke-width="${primitive.width ?? 2}"${primitive.dash ? ' stroke-dasharray="7 5"' : ''}/>`;
        }
        if (primitive.kind === 'rect') {
            return `<rect x="${formatNumber(primitive.x)}" y="${formatNumber(primitive.y)}" width="${formatNumber(primitive.width)}" height="${formatNumber(primitive.height)}" fill="${primitive.fill ?? 'none'}" stroke="#111827" stroke-width="${primitive.stroke_width ?? 2}"/>`;
        }
        if (primitive.kind === 'circle') {
            return `<circle cx="${formatNumber(primitive.cx)}" cy="${formatNumber(primitive.cy)}" r="${formatNumber(primitive.radius)}" fill="#111827"/>`;
        }
        const anchor = primitive.anchor ?? 'start';
        return `<text x="${formatNumber(primitive.x)}" y="${formatNumber(primitive.y)}" font-family="Arial, sans-serif" font-size="${primitive.size}" font-weight="${primitive.bold ? 700 : 400}" text-anchor="${anchor}" fill="${primitive.color ?? '#111827'}" opacity="${primitive.opacity ?? 1}">${escapeXml(primitive.value)}</text>`;
    });
    return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${SHEET_WIDTH}mm" height="${SHEET_HEIGHT}mm" viewBox="0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}"><rect width="100%" height="100%" fill="white"/>${elements.join('')}</svg>`;
}
export function renderDxf(model) {
    const entities = [];
    const line = (x1, y1, x2, y2) => {
        entities.push(`0\nLINE\n8\n0\n10\n${formatNumber(x1)}\n20\n${formatNumber(SHEET_HEIGHT - y1)}\n30\n0\n11\n${formatNumber(x2)}\n21\n${formatNumber(SHEET_HEIGHT - y2)}\n31\n0`);
    };
    for (const primitive of model.primitives) {
        if (primitive.kind === 'line') {
            line(primitive.x1, primitive.y1, primitive.x2, primitive.y2);
        }
        else if (primitive.kind === 'rect') {
            line(primitive.x, primitive.y, primitive.x + primitive.width, primitive.y);
            line(primitive.x + primitive.width, primitive.y, primitive.x + primitive.width, primitive.y + primitive.height);
            line(primitive.x + primitive.width, primitive.y + primitive.height, primitive.x, primitive.y + primitive.height);
            line(primitive.x, primitive.y + primitive.height, primitive.x, primitive.y);
        }
        else if (primitive.kind === 'circle') {
            entities.push(`0\nCIRCLE\n8\n0\n10\n${formatNumber(primitive.cx)}\n20\n${formatNumber(SHEET_HEIGHT - primitive.cy)}\n30\n0\n40\n${formatNumber(primitive.radius)}`);
        }
        else {
            entities.push(`0\nTEXT\n8\n0\n10\n${formatNumber(primitive.x)}\n20\n${formatNumber(SHEET_HEIGHT - primitive.y)}\n30\n0\n40\n${primitive.size}\n1\n${printable(primitive.value)}\n7\nSTANDARD`);
        }
    }
    const header = '0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n9\n$INSUNITS\n70\n4\n0\nENDSEC';
    const tables = [
        '0\nSECTION\n2\nTABLES',
        '0\nTABLE\n2\nLTYPE\n70\n1\n0\nLTYPE\n2\nCONTINUOUS\n70\n0\n3\nSolid line\n72\n65\n73\n0\n40\n0',
        '0\nENDTAB',
        '0\nTABLE\n2\nLAYER\n70\n1\n0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS',
        '0\nENDTAB',
        '0\nTABLE\n2\nSTYLE\n70\n1\n0\nSTYLE\n2\nSTANDARD\n70\n0\n40\n0\n41\n1\n50\n0\n71\n0\n42\n2.5\n3\ntxt\n4\n',
        '0\nENDTAB\n0\nENDSEC',
    ].join('\n');
    return `${header}\n${tables}\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${entities.join('\n')}\n0\nENDSEC\n0\nEOF\n`;
}
function pdfEscape(value) {
    return printable(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}
export function renderPdf(model) {
    const operations = [];
    for (const primitive of model.primitives) {
        if (primitive.kind === 'line') {
            operations.push(`${formatNumber(primitive.x1)} ${formatNumber(SHEET_HEIGHT - primitive.y1)} m ${formatNumber(primitive.x2)} ${formatNumber(SHEET_HEIGHT - primitive.y2)} l S`);
        }
        else if (primitive.kind === 'rect') {
            operations.push(`${formatNumber(primitive.x)} ${formatNumber(SHEET_HEIGHT - primitive.y - primitive.height)} ${formatNumber(primitive.width)} ${formatNumber(primitive.height)} re S`);
        }
        else if (primitive.kind === 'circle') {
            const x = primitive.cx;
            const y = SHEET_HEIGHT - primitive.cy;
            const r = primitive.radius;
            const c = r * 0.5522847498;
            operations.push(`${formatNumber(x + r)} ${formatNumber(y)} m ${formatNumber(x + r)} ${formatNumber(y + c)} ${formatNumber(x + c)} ${formatNumber(y + r)} ${formatNumber(x)} ${formatNumber(y + r)} c ${formatNumber(x - c)} ${formatNumber(y + r)} ${formatNumber(x - r)} ${formatNumber(y + c)} ${formatNumber(x - r)} ${formatNumber(y)} c ${formatNumber(x - r)} ${formatNumber(y - c)} ${formatNumber(x - c)} ${formatNumber(y - r)} ${formatNumber(x)} ${formatNumber(y - r)} c ${formatNumber(x + c)} ${formatNumber(y - r)} ${formatNumber(x + r)} ${formatNumber(y - c)} ${formatNumber(x + r)} ${formatNumber(y)} c S`);
        }
        else {
            const textX = primitive.anchor === 'middle' ? primitive.x - primitive.value.length * primitive.size * 0.25 : primitive.anchor === 'end' ? primitive.x - primitive.value.length * primitive.size * 0.5 : primitive.x;
            operations.push(`BT /F1 ${primitive.size} Tf ${formatNumber(textX)} ${formatNumber(SHEET_HEIGHT - primitive.y)} Td (${pdfEscape(primitive.value)}) Tj ET`);
        }
    }
    const stream = operations.join('\n');
    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${SHEET_WIDTH} ${SHEET_HEIGHT}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const [index, object] of objects.entries()) {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    }
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets.slice(1)) {
        pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return new TextEncoder().encode(pdf);
}
