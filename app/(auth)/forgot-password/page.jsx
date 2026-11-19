import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
export default function ForgotPasswordPage() {
    return <AuthShell title="Reset access." subtitle="We’ll send a secure link to your work email."><AuthForm mode="forgot"/></AuthShell>;
}
