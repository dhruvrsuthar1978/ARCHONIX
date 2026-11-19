export function boxesOverlap(first, second) {
    return first.x < second.x + second.width &&
        first.x + first.width > second.x &&
        first.y < second.y + second.height &&
        first.y + first.height > second.y;
}
export function placeLabels(requests) {
    const placed = [];
    for (const request of requests) {
        const width = Math.max(request.font_size * 2, request.text.length * request.font_size * 0.58);
        const height = request.font_size * 1.25;
        const offsets = [0, -height * 1.5, height * 1.5, -height * 3, height * 3];
        let result;
        for (const offset of offsets) {
            const bounds = { x: request.x, y: request.y + offset - height, width, height };
            const withinRegion = bounds.x >= request.region.x &&
                bounds.y >= request.region.y &&
                bounds.x + bounds.width <= request.region.x + request.region.width &&
                bounds.y + bounds.height <= request.region.y + request.region.height;
            if (withinRegion && !placed.some((label) => boxesOverlap(bounds, label.bounds))) {
                result = { ...request, y: request.y + offset, bounds };
                break;
            }
        }
        if (!result) {
            throw new Error(`Unable to place label without overlap: "${request.text}"`);
        }
        placed.push(result);
    }
    return placed;
}
