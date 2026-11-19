import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function usePathname() {
  return useLocation().pathname
}

export function useRouter() {
  const navigate = useNavigate()
  return useMemo(() => ({
    push: (path) => navigate(path),
    replace: (path) => navigate(path, { replace: true }),
  }), [navigate])
}
