import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
export const api = axios.create({ baseURL: apiBaseUrl, timeout: 30000 });
export function saveAccessToken(token) {
    window.localStorage.setItem('access_token', token);
}
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = window.localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
export function getApiErrorMessage(error) {
    if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === 'string')
            return detail;
        if (Array.isArray(detail)) {
            return detail
                .map((item) => (typeof item?.msg === 'string' ? item.msg : 'Invalid request'))
                .join(', ');
        }
        if (!error.response)
            return 'Cannot reach the backend. Check that it is running and try again.';
    }
    return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
