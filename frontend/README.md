# Form//CAD frontend

The frontend is a React SPA built with Vite and JavaScript/JSX.

## Run locally

```powershell
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000` in `.env.local` to point the SPA at FastAPI.
Only `VITE_` variables are exposed to browser code; never put API keys in them.

## Validate

```powershell
npm test
npm run build
```
