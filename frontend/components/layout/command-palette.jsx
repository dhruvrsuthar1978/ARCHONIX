'use client';
import { Command as CommandIcon, FileText, FolderKanban, Settings2 } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useProjects } from '@/hooks/use-workspace-data';
import { useRouter } from '@/lib/router';
import { formatDate } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
const pages = [
    { href: '/dashboard', label: 'Dashboard', icon: FolderKanban },
    { href: '/designs/new', label: 'New design', icon: CommandIcon },
    { href: '/history', label: 'Design history', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings2 },
];
const itemClassName = 'min-w-0 gap-3 rounded-lg py-3 text-slate-200 data-[selected=true]:bg-slate-800';
export function CommandPalette() {
    const router = useRouter();
    const { data: projects = [], isLoading, isError } = useProjects();
    const open = useWorkspaceStore((state) => state.commandOpen);
    const setOpen = useWorkspaceStore((state) => state.setCommandOpen);
    function navigate(href) {
        setOpen(false);
        router.push(href);
    }
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden border-slate-700 bg-slate-950 p-0 shadow-2xl shadow-blue-950/40 sm:max-w-xl">
        <DialogTitle className="sr-only">Search workspace</DialogTitle>
        <DialogDescription className="sr-only">Search designs, pages, and actions.</DialogDescription>

        <Command className="bg-transparent text-slate-200">
          <CommandInput placeholder="Search designs, pages, and actions…" className="h-14 border-b border-slate-800 text-sm"/>
          <CommandList className="max-h-80 p-2">
            <CommandEmpty className="py-8 text-sm text-slate-500">No matching workspace items.</CommandEmpty>

            <CommandGroup heading="Navigate" className="px-1 text-slate-500">
              {pages.map(({ href, label, icon: Icon }) => (<CommandItem key={href} value={`${label} ${href}`} onSelect={() => navigate(href)} className={itemClassName}>
                  <Icon className="size-4 text-blueprint-cyan"/>
                  {label}
                </CommandItem>))}
            </CommandGroup>

            <CommandGroup heading="Recent designs" className="px-1 text-slate-500">
              {projects.slice(0, 5).map((project) => {
                const meta = `${project.status} · ${formatDate(project.updatedAt)}`;
                const href = `/designs/${project.id}/results`;
                return <CommandItem key={project.id} value={`${project.name} ${meta}`} onSelect={() => navigate(href)} className={itemClassName}>
                  <FileText className="size-4 shrink-0 text-slate-500"/>
                  <span className="min-w-0 flex-1 truncate" title={project.name}>{project.name}</span>
                  <span className="ml-auto hidden shrink-0 font-data text-[10px] text-slate-500 sm:inline">{meta}</span>
                </CommandItem>;
              })}
              {!isLoading && !isError && projects.length === 0 ? <p className="px-3 py-3 text-xs text-slate-500">No designs in this account yet.</p> : null}
              {isError ? <p className="px-3 py-3 text-xs text-blueprint-danger">Designs could not be loaded.</p> : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>);
}
