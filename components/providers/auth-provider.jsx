'use client';
import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { api, getApiErrorMessage } from '@/lib/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [error, setError] = useState();
    const [retryCount, setRetryCount] = useState(0);
    useEffect(() => {
        let active = true;
        const token = window.localStorage.getItem('access_token');
        if (!token) {
            router.replace('/login');
            return () => {
                active = false;
            };
        }
        api.get('/api/auth/me')
            .then(({ data }) => {
            if (active) {
                setUser(data);
                setError(undefined);
            }
        })
            .catch((requestError) => {
            if (!active)
                return;
            if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
                window.localStorage.removeItem('access_token');
                router.replace('/login');
                return;
            }
            setError(getApiErrorMessage(requestError));
        });
        return () => {
            active = false;
        };
    }, [retryCount, router]);
    const signOut = useCallback(() => {
        window.localStorage.removeItem('access_token');
        setUser(null);
        router.replace('/login');
    }, [router]);
    if (!user && !error) {
        return <div className="flex min-h-svh items-center justify-center text-sm text-slate-400">Checking your session…</div>;
    }
    if (error) {
        return (<main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="alert" className="text-sm text-blueprint-danger">{error}</p>
        <Button onClick={() => setRetryCount((count) => count + 1)}>Retry</Button>
      </main>);
    }
    return user ? (<AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>) : null;
}
export function useAuthSession() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuthSession must be used within AuthProvider.');
    return context;
}
