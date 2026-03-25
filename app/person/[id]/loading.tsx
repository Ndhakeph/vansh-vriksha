export default function PersonLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-forest/10 px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-forest/10" />
          <div className="h-5 w-28 animate-pulse rounded bg-forest/10" />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 flex flex-col items-center sm:flex-row sm:items-start">
          <div className="mb-6 h-32 w-32 animate-pulse rounded-full bg-forest/10 sm:mb-0 sm:mr-8" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 animate-pulse rounded bg-forest/10" />
            <div className="h-4 w-32 animate-pulse rounded bg-forest/10" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gold/10" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-forest/5" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-forest/5" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-forest/5" />
        </div>
      </main>
    </div>
  );
}
