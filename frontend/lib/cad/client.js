import axios from 'axios'
import { z } from 'zod'

import { api } from '@/lib/api'
import { buildDrawingModel, RENDERER_VERSION, renderDxf, renderPdf, renderSvg } from './renderer.js'
import { DoorSpecSchema } from './spec.js'

const drawingMetadataSchema = z.object({
  project_name: z.string(),
  drawing_date: z.string(),
  revision: z.string(),
  sheet_number: z.string(),
  drawn_by: z.string(),
  preliminary: z.boolean(),
})

const pipelineResponseSchema = z.object({
  job_id: z.string().uuid(),
  status: z.string(),
  message: z.string(),
  project_name: z.string(),
  width_mm: z.number(),
  height_mm: z.number(),
  section_mm: z.number(),
  material: z.string(),
  finish: z.string(),
  spec: DoorSpecSchema,
  prompt: z.string(),
  drawing_metadata: drawingMetadataSchema,
  warnings: z.array(z.string()),
})

const cadPreviewSchema = pipelineResponseSchema.omit({
  prompt: true,
  drawing_metadata: true,
}).extend({
  preview_svg: z.string().min(1),
  renderer_version: z.string(),
})

export class CadPipelineError extends Error {
  constructor(message, errors = [], warnings = [], statusCode = 0) {
    super(message)
    this.name = 'CadPipelineError'
    this.errors = errors
    this.warnings = warnings
    this.statusCode = statusCode
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

function encodeBase64(value) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }
  return btoa(binary)
}

export async function postCadPipeline(path, projectId) {
  if (!window.localStorage.getItem('access_token')) {
    throw new CadPipelineError('Your session has expired. Sign in again to continue.')
  }

  try {
    const { data } = await api.post(path, { project_id: projectId })
    const pipeline = pipelineResponseSchema.safeParse(data)
    if (!pipeline.success) {
      throw new CadPipelineError('The CAD server returned an invalid specification response.')
    }

    const model = buildDrawingModel(pipeline.data.spec, pipeline.data.drawing_metadata)
    const svg = renderSvg(model)
    const dxf = renderDxf(model)
    const pdf = renderPdf(model)
    await api.put(`/api/projects/${projectId}/cad-artifacts`, {
      prompt: pipeline.data.prompt,
      validated_spec: pipeline.data.spec,
      renderer_version: RENDERER_VERSION,
      drawing_metadata: pipeline.data.drawing_metadata,
      artifacts: {
        svg: encodeBase64(svg),
        dxf: encodeBase64(dxf),
        pdf: encodeBase64(pdf),
      },
    })

    const preview = cadPreviewSchema.safeParse({
      ...pipeline.data,
      preview_svg: svg,
      renderer_version: RENDERER_VERSION,
    })
    if (!preview.success) {
      throw new CadPipelineError('The generated drawing preview is invalid.')
    }
    return preview.data
  } catch (error) {
    if (error instanceof CadPipelineError) throw error

    const body = axios.isAxiosError(error) ? error.response?.data : null
    const detail = isRecord(body) && isRecord(body.detail) ? body.detail : body
    const statusCode = axios.isAxiosError(error) ? error.response?.status ?? 0 : 0
    const message = isRecord(detail) && typeof detail.message === 'string'
      ? detail.message
      : isRecord(body) && typeof body.detail === 'string'
        ? body.detail
        : error instanceof Error ? error.message : 'CAD generation failed.'
    throw new CadPipelineError(
      message,
      isRecord(detail) ? stringArray(detail.errors) : [],
      isRecord(detail) ? stringArray(detail.warnings) : [],
      statusCode,
    )
  }
}
