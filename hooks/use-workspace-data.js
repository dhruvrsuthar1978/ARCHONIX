import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
function projectStatus(status) {
    return status === 'processing' || status === 'ready' || status === 'failed' ? status : 'draft';
}
function projectText(metadata, key) {
    const value = metadata[key];
    return typeof value === 'string' ? value.replaceAll('-', ' ') : '—';
}
export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data } = await api.get('/api/projects');
            return data.map((project) => {
                if (!project.id || !project.created_at || !project.updated_at) {
                    throw new Error('The backend returned an incomplete project record.');
                }
                const metadata = project.metadata ?? {};
                const cad = metadata.cad;
                const generatedFileIds = typeof cad === 'object' && cad !== null && 'generated_file_ids' in cad
                    ? cad.generated_file_ids
                    : null;
                const generatedFileCount = typeof generatedFileIds === 'object' && generatedFileIds !== null
                    ? Object.keys(generatedFileIds).length
                    : 0;
                return {
                    id: project.id,
                    name: project.name,
                    status: projectStatus(project.status),
                    material: projectText(metadata, 'material'),
                    finish: projectText(metadata, 'finish'),
                    widthMm: Number.isFinite(Number(metadata.width_mm)) ? Number(metadata.width_mm) : null,
                    heightMm: Number.isFinite(Number(metadata.height_mm)) ? Number(metadata.height_mm) : null,
                    sectionMm: Number.isFinite(Number(metadata.section_mm)) ? Number(metadata.section_mm) : null,
                    costMaterial: typeof metadata.material === 'string' ? metadata.material : undefined,
                    costFinish: typeof metadata.finish === 'string' ? metadata.finish : undefined,
                    createdAt: project.created_at,
                    updatedAt: project.updated_at,
                    generatedFileCount,
                };
            });
        },
    });
}
export function useCostEstimates() {
    const projectsQuery = useProjects();
    const projects = projectsQuery.data ?? [];
    const estimatesQuery = useQuery({
        queryKey: ['cost-estimates', projects.map((project) => [project.id, project.updatedAt])],
        enabled: projectsQuery.isSuccess,
        queryFn: async () => {
            const eligibleProjects = projects.filter((project) => project.widthMm > 0 && project.heightMm > 0);
            return Promise.all(eligibleProjects.map(async (project) => {
                const { data } = await api.post('/api/costing/estimate', {
                    width_mm: project.widthMm,
                    height_mm: project.heightMm,
                    section_mm: project.sectionMm ?? 60,
                    material: project.costMaterial,
                    finish: project.costFinish,
                });
                return { ...project, estimate: data };
            }));
        },
    });
    return {
        ...estimatesQuery,
        isLoading: projectsQuery.isLoading || estimatesQuery.isLoading,
        isError: projectsQuery.isError || estimatesQuery.isError,
    };
}
export function useGeneratedFiles() {
    return useQuery({
        queryKey: ['generated-files'],
        queryFn: async () => {
            const { data } = await api.get('/api/files');
            return data.map((file) => ({
                id: file.id,
                projectId: file.project_id,
                projectName: file.project_name,
                name: file.name,
                format: file.format,
                sizeBytes: file.size_bytes,
                status: file.status,
                createdAt: file.created_at,
            }));
        },
    });
}
export function useCreateDesign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await api.post('/api/projects', {
                name: payload.name,
                status: 'draft',
                metadata: {
                    description: payload.description,
                    material: payload.material,
                    finish: payload.finish,
                    width_mm: payload.widthMm,
                    height_mm: payload.heightMm,
                    section_mm: payload.sectionMm ?? 60,
                    budget: payload.budget,
                    reference_file: payload.referenceFile,
                },
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });
}
