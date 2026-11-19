import { Bell, KeyRound, Palette, UserRound } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useAuthSession } from '@/components/providers/auth-provider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SettingsForm() {
  const { user } = useAuthSession()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Tabs defaultValue="profile" orientation="vertical" className="grid gap-6 lg:grid-cols-[190px_1fr]">
      <TabsList className="h-auto w-full flex-col items-stretch justify-start bg-transparent p-0">
        <TabsTrigger value="profile" className="justify-start gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><UserRound className="size-4"/>Profile</TabsTrigger>
        <TabsTrigger value="api" className="justify-start gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><KeyRound className="size-4"/>API keys</TabsTrigger>
        <TabsTrigger value="notifications" className="justify-start gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Bell className="size-4"/>Notifications</TabsTrigger>
        <TabsTrigger value="appearance" className="justify-start gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white"><Palette className="size-4"/>Appearance</TabsTrigger>
      </TabsList>
      <div className="min-w-0">
        <TabsContent value="profile" className="mt-0 rounded-xl border border-slate-800 bg-slate-900/55 p-5">
          <p className="text-sm font-semibold text-white">Profile details</p>
          <p className="mt-1 text-xs text-slate-500">Account information for the currently signed-in user.</p>
          <Separator className="my-5 bg-slate-800"/>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-xs text-slate-400">Full name</Label>
              <Input id="profile-name" value={user.full_name} readOnly className="h-10 rounded-lg border-slate-700 bg-slate-950/50 text-sm"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-xs text-slate-400">Work email</Label>
              <Input id="profile-email" value={user.email} readOnly className="h-10 rounded-lg border-slate-700 bg-slate-950/50 text-sm"/>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Profile editing is not available yet.</p>
        </TabsContent>

        <TabsContent value="api" className="mt-0 rounded-xl border border-slate-800 bg-slate-900/55 p-5">
          <p className="text-sm font-semibold text-white">API keys</p>
          <p className="mt-1 text-xs text-slate-500">No API keys are connected to this account.</p>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 rounded-xl border border-slate-800 bg-slate-900/55 p-5">
          <p className="text-sm font-semibold text-white">Notifications</p>
          <p className="mt-1 text-xs text-slate-500">Notification preferences are not available yet.</p>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0 rounded-xl border border-slate-800 bg-slate-900/55 p-5">
          <p className="text-sm text-slate-200">Dark workspace</p>
          <p className="mt-1 text-xs text-slate-500">Choose the workspace appearance for this browser.</p>
          <div className="mt-5 flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div>
              <p className="text-sm text-slate-200">Dark theme</p>
              <p className="mt-1 text-xs text-slate-500">Optimized for long review sessions.</p>
            </div>
            <Switch checked={resolvedTheme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}/>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  )
}
