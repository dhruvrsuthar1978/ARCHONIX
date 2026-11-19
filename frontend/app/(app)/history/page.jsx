import { PageHeading } from '@/components/shared/page-heading';
import { Button } from '@/components/ui/button';
import { HistoryTable } from '@/components/history/history-table';
import Link from '@/components/shared/link';
import { Plus } from 'lucide-react';
export default function HistoryPage() {
    return <div className="mx-auto max-w-[1440px] space-y-7"><PageHeading eyebrow="Workspace / archive" title="Design history" description="Scan every brief, status, material, cost, and export from one source of truth." action={<Button asChild className="h-10 rounded-lg bg-blueprint-accent text-xs text-white hover:bg-blue-500"><Link href="/designs/new"><Plus className="size-3.5"/> New design</Link></Button>}/><HistoryTable /></div>;
}
