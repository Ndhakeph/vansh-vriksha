export default function TreeLoading() {
  return (
    <div className="flex h-screen flex-col bg-cream">
      <header className="flex items-center justify-between border-b border-forest/10 px-6 py-3">
        <div className="h-6 w-32 animate-pulse rounded bg-forest/10" />
        <div className="h-4 w-64 animate-pulse rounded bg-forest/10" />
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />
          <p className="text-sm text-forest/50">Loading family tree...</p>
        </div>
      </main>
    </div>
  );
}
