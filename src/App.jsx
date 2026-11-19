import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppShell } from '@/components/layout/app-shell'
import LandingPage from '@/app/page.jsx'
import NotFoundPage from '@/app/not-found.jsx'
import LoginPage from '@/app/(auth)/login/page.jsx'
import SignupPage from '@/app/(auth)/signup/page.jsx'
import ForgotPasswordPage from '@/app/(auth)/forgot-password/page.jsx'
import DashboardPage from '@/app/(app)/dashboard/page.jsx'
import HistoryPage from '@/app/(app)/history/page.jsx'
import FilesPage from '@/app/(app)/files/page.jsx'
import CostEstimatesPage from '@/app/(app)/cost-estimates/page.jsx'
import SettingsPage from '@/app/(app)/settings/page.jsx'
import NewDesignPage from '@/app/(app)/designs/new/page.jsx'
import ResultsPage from '@/app/(app)/designs/[id]/results/page.jsx'
import ProcessingPage from '@/app/(app)/designs/[id]/processing/page.jsx'
import '../app/globals.css'

function ProductLayout() {
  return <AppShell><Outlet /></AppShell>
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <TooltipProvider delayDuration={250}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<ProductLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/cost-estimates" element={<CostEstimatesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/designs/new" element={<NewDesignPage />} />
              <Route path="/designs/:id/results" element={<ResultsPage />} />
              <Route path="/designs/:id/processing" element={<ProcessingPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster theme="dark" richColors />
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
