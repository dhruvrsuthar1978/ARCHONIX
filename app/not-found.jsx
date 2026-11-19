export default function NotFound() {
    return (<main className="flex min-h-screen items-center justify-center text-slate-100">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-slate-300">The requested route does not exist in this demo app.</p>
      </div>
    </main>);
}
