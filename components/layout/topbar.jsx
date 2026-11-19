'use client';
import Link from '@/components/shared/link';
import { Bell, ChevronDown, ChevronLeft, Command, Menu, Plus, Search, Sparkles } from 'lucide-react';
import { useAuthSession } from '@/components/providers/auth-provider';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
export function Topbar({ title = 'Dashboard', sidebarOpen = true, onToggleSidebar }) {
    const { user, signOut } = useAuthSession();
    const setCommandOpen = useWorkspaceStore((state) => state.setCommandOpen);
    const setMobileNavOpen = useWorkspaceStore((state) => state.setMobileNavOpen);
    return (<header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[color:var(--border)] bg-[color:var(--card)]/85 px-4 backdrop-blur-xl sm:px-6">
      <Button variant="ghost" size="icon" className="size-9 rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)] lg:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
        <Menu className="size-4"/>
      </Button>

      <Button variant="ghost" size="icon" className="hidden size-9 rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)] lg:inline-flex" onClick={onToggleSidebar} aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
        {sidebarOpen ? <ChevronLeft className="size-4"/> : <Menu className="size-4"/>}
      </Button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[color:var(--foreground)]">{title}</p>
        <p className="hidden truncate text-xs text-[color:var(--muted-foreground)] lg:block">Workspace / {title.toLowerCase()}</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button asChild className="hidden h-9 rounded-lg bg-[color:var(--primary)] px-3 text-xs text-[color:var(--primary-foreground)] shadow-lg shadow-violet-900/20 hover:bg-[color:var(--primary)]/90 sm:inline-flex">
          <Link href="/designs/new">
            <Plus className="size-3.5"/> New design
          </Link>
        </Button>

        <Button variant="outline" className="hidden h-9 min-w-56 justify-start gap-2 rounded-lg border-[color:var(--border)] bg-[color:var(--secondary)] px-3 text-xs font-normal text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)]/80 xl:flex" onClick={() => setCommandOpen(true)}>
          <Search className="size-3.5"/> Press <span className="font-data text-[10px] text-[color:var(--muted-foreground)]">⌘K</span> to search designs
        </Button>

        <Button variant="ghost" size="icon" className="size-9 rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)] xl:hidden" onClick={() => setCommandOpen(true)} aria-label="Search workspace">
          <Search className="size-4"/>
        </Button>

        <ThemeToggle compact/>

        <Button variant="ghost" size="icon" className="hidden size-9 rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)] sm:inline-flex" aria-label="Notifications unavailable" title="Notifications are not available yet" disabled>
          <Bell className="size-4"/>
        </Button>

        <div className="hidden h-5 w-px bg-[color:var(--border)] sm:block"/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 min-w-0 shrink-0 gap-2 rounded-lg px-1.5 text-[color:var(--foreground)] hover:bg-[color:var(--secondary)]">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-blue-500/15 text-xs font-semibold text-[color:var(--blueprint-cyan)]">
                  {(user.full_name.trim() || user.email).slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-36 truncate text-xs font-medium md:inline">{user.full_name || user.email}</span>
              <ChevronDown className="hidden size-3.5 shrink-0 text-[color:var(--muted-foreground)] md:inline"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10} className="w-56 border-[color:var(--border)] bg-[color:var(--card)] p-2 text-[color:var(--foreground)]">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer gap-2 rounded-md px-2 py-2 text-sm text-[color:var(--foreground)] focus:bg-[color:var(--secondary)] focus:text-[color:var(--foreground)]">
              <Sparkles className="size-4 text-[color:var(--blueprint-cyan)]"/>Workspace profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 rounded-md px-2 py-2 text-sm text-[color:var(--foreground)] focus:bg-[color:var(--secondary)] focus:text-[color:var(--foreground)]" onSelect={() => setCommandOpen(true)}>
              <Command className="size-4 text-[color:var(--blueprint-cyan)]"/>Command center
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[color:var(--border)]"/>
            <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-[color:var(--foreground)] focus:bg-[color:var(--secondary)] focus:text-[color:var(--foreground)]" onSelect={signOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>);
}
