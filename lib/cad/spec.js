import { z } from 'zod';
export const DoorSpecSchema = z.object({
    door_type: z.enum(['single', 'double']),
    leaf_count: z.number().int().min(1).max(2),
    overall_width_mm: z.number().positive(),
    overall_height_mm: z.number().positive(),
    frame_section_mm: z.number().positive(),
    leaf_thickness_mm: z.number().positive(),
    material: z.string().min(1).max(100),
    finish: z.string().min(1).max(100),
    hinges: z.object({
        count: z.number().int().min(2).max(6),
        positions_mm: z.array(z.number().positive()).min(2).max(6),
    }).strict(),
    lock_handle: z.object({
        stile_side: z.enum(['left', 'right', 'meeting']),
        height_mm: z.number().positive(),
    }).strict(),
    glazing: z.object({
        included: z.boolean(),
        pane_count: z.number().int().min(0).max(4),
        width_mm: z.number().positive().nullable(),
        height_mm: z.number().positive().nullable(),
    }).strict(),
    notes: z.array(z.string().min(1).max(120)).max(4),
}).strict();
export const doorSpecJsonSchema = {
    type: 'object',
    additionalProperties: false,
    required: [
        'door_type',
        'leaf_count',
        'overall_width_mm',
        'overall_height_mm',
        'frame_section_mm',
        'leaf_thickness_mm',
        'material',
        'finish',
        'hinges',
        'lock_handle',
        'glazing',
        'notes',
    ],
    properties: {
        door_type: { type: 'string', enum: ['single', 'double'] },
        leaf_count: { type: 'integer', minimum: 1, maximum: 2 },
        overall_width_mm: { type: 'number', exclusiveMinimum: 0 },
        overall_height_mm: { type: 'number', exclusiveMinimum: 0 },
        frame_section_mm: { type: 'number', exclusiveMinimum: 0 },
        leaf_thickness_mm: { type: 'number', exclusiveMinimum: 0 },
        material: { type: 'string', minLength: 1, maxLength: 100 },
        finish: { type: 'string', minLength: 1, maxLength: 100 },
        hinges: {
            type: 'object',
            additionalProperties: false,
            required: ['count', 'positions_mm'],
            properties: {
                count: { type: 'integer', minimum: 2, maximum: 6 },
                positions_mm: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 6,
                    items: { type: 'number', exclusiveMinimum: 0 },
                },
            },
        },
        lock_handle: {
            type: 'object',
            additionalProperties: false,
            required: ['stile_side', 'height_mm'],
            properties: {
                stile_side: { type: 'string', enum: ['left', 'right', 'meeting'] },
                height_mm: { type: 'number', exclusiveMinimum: 0 },
            },
        },
        glazing: {
            type: 'object',
            additionalProperties: false,
            required: ['included', 'pane_count', 'width_mm', 'height_mm'],
            properties: {
                included: { type: 'boolean' },
                pane_count: { type: 'integer', minimum: 0, maximum: 4 },
                width_mm: { anyOf: [{ type: 'number', exclusiveMinimum: 0 }, { type: 'null' }] },
                height_mm: { anyOf: [{ type: 'number', exclusiveMinimum: 0 }, { type: 'null' }] },
            },
        },
        notes: {
            type: 'array',
            maxItems: 4,
            items: { type: 'string', minLength: 1, maxLength: 120 },
        },
    },
};
