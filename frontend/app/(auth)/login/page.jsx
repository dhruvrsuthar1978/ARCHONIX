import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
export default function LoginPage() {
    return <AuthShell title="Welcome back." subtitle="Sign in to continue building production-ready geometry."><AuthForm /></AuthShell>;
}
