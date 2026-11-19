'use client';
import Link from '@/components/shared/link';
import { usePathname } from '@/lib/router';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Box, CircleDollarSign, FileBox, History, LayoutDashboard, Plus, Settings2, Sparkles, X } from 'lucide-react';
import { CommandPalette } from '@/components/layout/command-palette';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Topbar } from '@/components/layout/topbar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { QueryProvider } from '@/lib/query-provider';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { AuthProvider } from '@/components/providers/auth-provider';
const navigation = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/designs/new', label: 'New Design', icon: Plus, accent: true },
    { href: '/history', label: 'Design History', icon: History },
    { href: '/cost-estimates', label: 'Cost Estimates', icon: CircleDollarSign },
    { href: '/files', label: 'Generated Files', icon: FileBox },
    { href: '/settings', label: 'Settings', icon: Settings2 },
];
function Navigation({ compact = false, onNavigate }) {
    const pathname = usePathname();
    return (<nav className={cn('space-y-1', compact && 'px-1')} aria-label="Primary navigation">
      {navigation.map(({ href, label, icon: Icon, accent }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (<Tooltip key={href}>
            <TooltipTrigger asChild>
              <Link href={href} onClick={onNavigate} className={cn('group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors', compact ? 'justify-center px-0' : '', active ? 'bg-[color:var(--primary)]/10 text-[color:var(--foreground)]' : 'text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]', accent && !active && 'text-[color:var(--blueprint-cyan)]')}>
                <AnimatePresence>
                  {active ? <motion.span layoutId="nav-active" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[color:var(--blueprint-cyan)]"/> : null}
                </AnimatePresence>
                <Icon className={cn('size-4 shrink-0', active ? 'text-[color:var(--blueprint-cyan)]' : accent ? 'text-[color:var(--blueprint-cyan)]' : 'text-[color:var(--muted-foreground)]')}/>
                <span className={cn(compact && 'sr-only')}>{label}</span>
                {accent && !compact ? <span className="ml-auto rounded-full bg-[color:var(--blueprint-cyan)]/10 px-2 py-0.5 text-[10px] text-[color:var(--blueprint-cyan)]">⌘ N</span> : null}
              </Link>
            </TooltipTrigger>
            {compact ? <TooltipContent side="right" className="border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--foreground)]">{label}</TooltipContent> : null}
          </Tooltip>);
        })}
    </nav>);
}
const pageTitles = {
    '/dashboard': 'Dashboard',
    '/designs/new': 'New design',
    '/history': 'Design history',
    '/cost-estimates': 'Cost estimates',
    '/files': 'Generated files',
    '/settings': 'Settings',
};
function resolvePageTitle(pathname) {
    if (pathname.endsWith('/processing'))
        return 'Generation workflow';
    if (pathname.endsWith('/results'))
        return 'Design results';
    const match = Object.keys(pageTitles).find((href) => pathname === href || pathname.startsWith(`${href}/`));
    return match ? pageTitles[match] : 'Workspace';
}
export function AppShell({ children }) {
    const pathname = usePathname();
    const sidebarOpen = useWorkspaceStore((state) => state.sidebarOpen);
    const mobileNavOpen = useWorkspaceStore((state) => state.mobileNavOpen);
    const setSidebarOpen = useWorkspaceStore((state) => state.setSidebarOpen);
    const setMobileNavOpen = useWorkspaceStore((state) => state.setMobileNavOpen);
    return (<QueryProvider>
      <AuthProvider>
      <div className="min-h-svh bg-[color:var(--background)] text-[color:var(--foreground)]">
        <aside className={cn('scrollbar-thin fixed inset-y-0 left-0 z-40 hidden overflow-y-auto border-r border-[color:var(--border)] bg-[color:var(--background)]/95 lg:flex lg:flex-col', sidebarOpen ? 'w-[280px] p-4' : 'w-[88px] p-2')}>
          <div className={cn('flex items-center justify-between', !sidebarOpen && 'justify-center')}>
            <Link href="/dashboard" className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-lg shadow-violet-900/20" aria-label="Form CAD dashboard">
              <Box className="size-4"/>
            </Link>
            {sidebarOpen ? <span className="font-data text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">v1.4</span> : null}
          </div>

          {sidebarOpen ? (<>
              <div className="mt-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[color:var(--blueprint-cyan)]"/>
                  <span className="text-xs font-medium text-[color:var(--foreground)]">AI workspace</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-[color:var(--muted-foreground)]">Start a brief to create a project-specific design.</p>
                <Button asChild size="sm" className="mt-3 h-9 w-full rounded-xl bg-[color:var(--primary)] text-xs text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90">
                  <Link href="/designs/new"><Plus className="size-3.5"/> New design</Link>
                </Button>
              </div>

              <div className="mt-5">
                <p className="mb-2 px-2 font-data text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Workspace</p>
                <Navigation />
              </div>
            </>) : (<div className="mt-8 flex flex-col items-center gap-2">
              <Button variant="ghost" size="icon" className="size-10 rounded-xl text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Plus className="size-4"/>
              </Button>
              <Navigation compact/>
            </div>)}

          <div className={cn('mt-auto border-t border-[color:var(--border)] pt-3', !sidebarOpen && 'border-none pt-2')}>
            {sidebarOpen ? (<>
                <div className="mb-2 flex items-center justify-between px-2">
                  <p className="font-data text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">Quick actions</p>
                  <ThemeToggle />
                </div>
                <Link href="/history" className="mt-2 block rounded-xl px-3 py-2 hover:bg-[color:var(--secondary)]">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-[color:var(--foreground)]">Browse your designs</p>
                      <p className="mt-0.5 font-data text-[10px] text-[color:var(--muted-foreground)]">Open project history</p>
                    </div>
                    <BarChart3 className="size-4 shrink-0 text-[color:var(--blueprint-cyan)]"/>
                  </div>
                </Link>
              </>) : (<div className="flex justify-center pb-2">
                <ThemeToggle compact/>
              </div>)}
          </div>
        </aside>

        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" showCloseButton={false} className="w-[290px] border-[color:var(--border)] bg-[color:var(--background)]/95 p-0">
            <SheetHeader className="border-b border-[color:var(--border)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="flex size-9 items-center justify-center rounded-xl bg-[color:var(--primary)] text-[color:var(--primary-foreground)]">
                    <Box className="size-4"/>
                  </Link>
                  <div>
                    <SheetTitle className="text-left text-base font-semibold text-[color:var(--foreground)]">FORM<span className="text-[color:var(--blueprint-cyan)]">&#47;&#47;</span>CAD</SheetTitle>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-8 rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation">
                  <X className="size-4"/>
                </Button>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-4">
              <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--secondary)] p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[color:var(--blueprint-cyan)]"/>
                  <span className="text-xs font-medium text-[color:var(--foreground)]">AI workspace</span>
                </div>
                <p className="mt-2 text-[11px] leading-5 text-[color:var(--muted-foreground)]">Start a brief to create a project-specific design.</p>
              </div>

              <Navigation onNavigate={() => setMobileNavOpen(false)}/>

              <div className="border-t border-[color:var(--border)] pt-4">
                <Button asChild className="w-full rounded-xl bg-[color:var(--primary)] text-xs text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90">
                  <Link href="/designs/new"><Plus className="size-3.5"/> New design</Link>
                </Button>
              </div>

              <div className="border-t border-[color:var(--border)] pt-4">
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className={cn('flex min-h-svh flex-col transition-[padding] duration-300 ease-out', sidebarOpen ? 'lg:pl-[280px]' : 'lg:pl-[88px]')}>
          <Topbar title={resolvePageTitle(pathname)} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}/>
          <main id="main-content" className="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8">
            {children}
          </main>
        </div>

        <CommandPalette />
      </div>
      </AuthProvider>
    </QueryProvider>);
}
