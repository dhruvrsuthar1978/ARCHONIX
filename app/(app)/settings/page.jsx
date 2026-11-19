import { PageHeading } from '@/components/shared/page-heading';
import { SettingsForm } from '@/components/settings/settings-form';
export default function SettingsPage() {
    return <div className="mx-auto max-w-4xl space-y-7"><PageHeading eyebrow="Workspace / preferences" title="Settings" description="Manage your profile, integrations, notifications, and workspace appearance."/><SettingsForm /></div>;
}
