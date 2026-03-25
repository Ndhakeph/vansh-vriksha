export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded bg-forest/10" />
          <div className="h-4 w-48 animate-pulse rounded bg-forest/10" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-forest/10" />
      </div>
      <div className="overflow-hidden rounded-xl border border-forest/10 bg-white">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-forest/5 px-4 py-4 last:border-0"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-forest/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-forest/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-forest/10" />
            <div className="h-4 w-16 animate-pulse rounded bg-forest/10" />
            <div className="ml-auto h-4 w-12 animate-pulse rounded bg-forest/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
