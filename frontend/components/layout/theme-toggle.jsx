'use client';
import { MoonStar, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
export function ThemeToggle({ compact = false }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (<Button variant="ghost" size={compact ? 'icon' : 'default'} className="rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]" aria-label="Toggle theme" disabled>
        <SunMedium className="size-4"/>
        {!compact ? <span>Theme</span> : null}
      </Button>);
    }
    const isDark = resolvedTheme === 'dark';
    return (<Button variant="ghost" size={compact ? 'icon' : 'default'} className="rounded-lg text-[color:var(--muted-foreground)] hover:bg-[color:var(--secondary)] hover:text-[color:var(--foreground)]" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? <SunMedium className="size-4"/> : <MoonStar className="size-4"/>}
      {!compact ? <span>{isDark ? 'Light mode' : 'Dark mode'}</span> : null}
    </Button>);
}
