import { AuthForm } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
export default function SignupPage() {
    return <AuthShell title="Build your next baseline." subtitle="Create a workspace for briefs, constraints, costs, and CAD exports."><AuthForm mode="signup"/></AuthShell>;
}
