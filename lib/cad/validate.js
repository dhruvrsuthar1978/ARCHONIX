export function validateDoorSpec(spec, constraints) {
    const errors = [];
    const warnings = [];
    const brief = constraints.brief.toLowerCase();
    const dimensionMatch = brief.match(/\b(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*mm\b/i);
    const labeledWidth = brief.match(/\bwidth\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*mm\b/i);
    const labeledHeight = brief.match(/\bheight\s*(?:is|:)?\s*(\d+(?:\.\d+)?)\s*mm\b/i);
    if (spec.door_type === 'double' && spec.leaf_count !== 2) {
        errors.push('A double door must contain exactly two leaves.');
    }
    if (spec.door_type === 'single' && spec.leaf_count !== 1) {
        errors.push('A single door must contain exactly one leaf.');
    }
    if (/\b(double|two[- ]leaf|pair of doors)\b/.test(brief) && spec.door_type !== 'double') {
        errors.push('The brief requests a double door, but the specification is single-leaf.');
    }
    if (/\bsingle door\b/.test(brief) && spec.door_type !== 'single') {
        errors.push('The brief requests a single door, but the specification is double-leaf.');
    }
    if (spec.door_type === 'double' && spec.overall_width_mm < 1500) {
        warnings.push('Double-door overall width is under 1500 mm; verify the required clear opening.');
    }
    if (constraints.width_mm !== undefined && Math.abs(spec.overall_width_mm - constraints.width_mm) > 1) {
        errors.push(`The specification width (${spec.overall_width_mm} mm) does not match the entered width (${constraints.width_mm} mm).`);
    }
    if (constraints.height_mm !== undefined && Math.abs(spec.overall_height_mm - constraints.height_mm) > 1) {
        errors.push(`The specification height (${spec.overall_height_mm} mm) does not match the entered height (${constraints.height_mm} mm).`);
    }
    const briefWidth = labeledWidth ? Number(labeledWidth[1]) : dimensionMatch ? Number(dimensionMatch[1]) : undefined;
    const briefHeight = labeledHeight ? Number(labeledHeight[1]) : dimensionMatch ? Number(dimensionMatch[2]) : undefined;
    if (briefWidth !== undefined && briefWidth >= 500 && Math.abs(spec.overall_width_mm - briefWidth) > 1) {
        errors.push(`The specification width (${spec.overall_width_mm} mm) does not match the brief width (${briefWidth} mm).`);
    }
    if (briefHeight !== undefined && briefHeight >= 1000 && Math.abs(spec.overall_height_mm - briefHeight) > 1) {
        errors.push(`The specification height (${spec.overall_height_mm} mm) does not match the brief height (${briefHeight} mm).`);
    }
    const sectionMatch = brief.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:mm\s*)?section\b/i);
    if (sectionMatch) {
        const briefFrameSection = Number(sectionMatch[1]);
        const briefLeafThickness = Number(sectionMatch[2]);
        if (Math.abs(spec.frame_section_mm - briefFrameSection) > 1) {
            errors.push(`The frame section (${spec.frame_section_mm} mm) does not match the brief section (${briefFrameSection} mm).`);
        }
        if (Math.abs(spec.leaf_thickness_mm - briefLeafThickness) > 1) {
            errors.push(`The leaf thickness (${spec.leaf_thickness_mm} mm) does not match the brief section thickness (${briefLeafThickness} mm).`);
        }
    }
    if (spec.frame_section_mm * 2 >= Math.min(spec.overall_width_mm, spec.overall_height_mm)) {
        errors.push('Frame section must be less than half the smaller overall dimension.');
    }
    if (spec.leaf_thickness_mm >= spec.overall_width_mm / spec.leaf_count) {
        errors.push('Leaf thickness must be less than the width of one leaf.');
    }
    if (spec.hinges.count !== spec.hinges.positions_mm.length) {
        errors.push('Hinge count must match the number of specified hinge positions.');
    }
    const minimumHinges = spec.overall_height_mm > 2400 ? 4 : 3;
    if (spec.hinges.count < minimumHinges) {
        errors.push(`A ${spec.overall_height_mm} mm door requires at least ${minimumHinges} hinges.`);
    }
    const sortedHingePositions = [...spec.hinges.positions_mm].sort((a, b) => a - b);
    if (sortedHingePositions.some((position, index) => position >= spec.overall_height_mm ||
        (index > 0 && position - sortedHingePositions[index - 1] < 100))) {
        errors.push('Hinge positions must be inside the leaf and at least 100 mm apart.');
    }
    if (spec.lock_handle.height_mm < 800 || spec.lock_handle.height_mm > 1200) {
        errors.push('Lock/handle height must be between 800 mm and 1200 mm above finished floor.');
    }
    if (spec.lock_handle.height_mm >= spec.overall_height_mm) {
        errors.push('Lock/handle height must be below the top of the door leaf.');
    }
    if (spec.door_type === 'double' && spec.lock_handle.stile_side !== 'meeting') {
        errors.push('A double-door lock/handle must be located on the meeting stile.');
    }
    if (spec.door_type === 'single' && spec.lock_handle.stile_side === 'meeting') {
        errors.push('A single-door lock/handle cannot be located on a meeting stile.');
    }
    if (spec.glazing.included) {
        if (spec.glazing.pane_count < 1 || spec.glazing.width_mm === null || spec.glazing.height_mm === null) {
            errors.push('Glazed doors require at least one pane with width and height.');
        }
        else if (spec.glazing.width_mm >= spec.overall_width_mm / spec.leaf_count ||
            spec.glazing.height_mm >= spec.overall_height_mm) {
            errors.push('Glazing dimensions must fit within a single leaf.');
        }
    }
    else if (spec.glazing.pane_count !== 0 || spec.glazing.width_mm !== null || spec.glazing.height_mm !== null) {
        errors.push('Unglazed doors must not contain glazing dimensions or pane counts.');
    }
    return { errors, warnings };
}
