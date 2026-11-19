'use client';
import Link from '@/components/shared/link';
import { useRouter } from '@/lib/router';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api, getApiErrorMessage, saveAccessToken } from '@/lib/api';
export function AuthForm({ mode = 'login' }) {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState();
    const schema = z.object({
        email: z.string().email('Enter a valid work email.'),
        password: mode === 'forgot'
            ? z.string().optional()
            : z.string().min(8, 'Use at least 8 characters.'),
        full_name: mode === 'signup'
            ? z.string().trim().min(2, 'Enter your full name.')
            : z.string().optional(),
    });
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: '', password: '', full_name: '' },
    });
    const submit = async (values) => {
        setServerError(undefined);
        if (mode === 'forgot') {
            setServerError('Password reset is not available yet.');
            return;
        }
        try {
            const { data } = mode === 'signup'
                ? await api.post('/api/auth/register', {
                    email: values.email,
                    full_name: values.full_name,
                    password: values.password ?? '',
                })
                : await api.post('/api/auth/login', {
                    email: values.email,
                    password: values.password ?? '',
                });
            saveAccessToken(data.access_token);
            router.push('/dashboard');
        }
        catch (error) {
            const isInvalidLogin = mode === 'login'
                && axios.isAxiosError(error)
                && error.response?.status === 401;
            setServerError(isInvalidLogin
                ? 'Invalid email or password. If this is your first time here, create an account first.'
                : getApiErrorMessage(error));
        }
    };
    if (mode === 'forgot') {
        return (<form onSubmit={handleSubmit(submit)} className="space-y-5">
        {serverError ? <p role="alert" className="text-sm text-blueprint-danger">{serverError}</p> : null}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs text-slate-300">Work email</Label>
          <Input id="email" type="email" {...register('email')} placeholder="you@studio.co" className="h-11 rounded-lg border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-600"/>
          {errors.email ? <p className="text-xs text-blueprint-danger">{errors.email.message}</p> : null}
        </div>

        <Button className="h-11 w-full rounded-lg bg-blueprint-accent text-sm text-white hover:bg-blue-500" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin"/> : 'Send reset link'}
        </Button>

        <p className="text-center text-xs text-slate-500">
          <Link href="/login" className="text-blueprint-cyan hover:text-white">Back to sign in</Link>
        </p>
      </form>);
    }
    return (<form onSubmit={handleSubmit(submit)} className="space-y-5">
      {mode === 'signup' ? (<div className="space-y-2">
          <Label htmlFor="full_name" className="text-xs text-slate-300">Full name</Label>
          <Input id="full_name" type="text" {...register('full_name')} placeholder="Your name" className="h-11 rounded-lg border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-600"/>
          {errors.full_name ? <p className="text-xs text-blueprint-danger">{errors.full_name.message}</p> : null}
        </div>) : null}
      {serverError ? <p role="alert" className="text-sm text-blueprint-danger">{serverError}</p> : null}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs text-slate-300">Work email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@studio.co" className="h-11 rounded-lg border-slate-700 bg-slate-900 text-sm text-white placeholder:text-slate-600"/>
        {errors.email ? <p className="text-xs text-blueprint-danger">{errors.email.message}</p> : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs text-slate-300">Password</Label>
          {mode === 'login' ? (<Link href="/forgot-password" className="text-xs text-blueprint-cyan hover:text-white">
              Forgot password?
            </Link>) : null}
        </div>

        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="8+ characters" className="h-11 rounded-lg border-slate-700 bg-slate-900 pr-11 text-sm text-white placeholder:text-slate-600"/>
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-9 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-white" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
          </Button>
        </div>
        {errors.password ? <p className="text-xs text-blueprint-danger">{errors.password.message}</p> : null}
      </div>

      <Button className="h-11 w-full rounded-lg bg-blueprint-accent text-sm text-white hover:bg-blue-500" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin"/> : mode === 'signup' ? 'Create account' : 'Sign in'}
      </Button>

      <p className="text-center text-xs text-slate-500">
        {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link href={mode === 'signup' ? '/login' : '/signup'} className="text-blueprint-cyan hover:text-white">
          {mode === 'signup' ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </form>);
}
