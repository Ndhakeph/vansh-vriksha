import { notFound } from "next/navigation";
import Link from "next/link";
import { getPersonWithRelations } from "@/lib/queries/people";
import { getPhotosByPerson } from "@/lib/queries/photos";
import { getStoriesByPerson } from "@/lib/queries/stories";
import type { Person } from "@/types/database";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PersonLink({ person }: { person: Person }) {
  return (
    <Link
      href={`/person/${person.id}`}
      className="inline-flex items-center gap-2 rounded-lg border border-forest/10 bg-white px-3 py-2 text-sm text-forest transition-all hover:border-gold/40 hover:shadow-sm"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest/10 text-xs font-semibold text-forest">
        {person.first_name.charAt(0)}
      </span>
      <span>
        {person.first_name} {person.last_name}
      </span>
    </Link>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const person = await getPersonWithRelations(params.id);
  if (!person) return { title: "Not Found | VanshVriksha" };
  return {
    title: `${person.first_name} ${person.last_name} | VanshVriksha`,
  };
}

export default async function PersonPage({
  params,
}: {
  params: { id: string };
}) {
  const person = await getPersonWithRelations(params.id);
  if (!person) notFound();

  let photos: Awaited<ReturnType<typeof getPhotosByPerson>> = [];
  let stories: Awaited<ReturnType<typeof getStoriesByPerson>> = [];

  try {
    [photos, stories] = await Promise.all([
      getPhotosByPerson(params.id),
      getStoriesByPerson(params.id),
    ]);
  } catch {
    // Non-critical — page still renders without photos/stories
  }

  const lifespan = [
    person.date_of_birth ? formatDate(person.date_of_birth) : null,
    person.date_of_death ? formatDate(person.date_of_death) : null,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-forest/10 px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/tree"
            className="flex items-center gap-2 text-sm text-forest/60 transition-colors hover:text-forest"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Tree
          </Link>
          <Link
            href="/"
            className="font-display text-lg font-bold text-forest"
          >
            VanshVriksha
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Hero section */}
        <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          {/* Photo / Avatar */}
          <div className="mb-6 flex-shrink-0 sm:mb-0 sm:mr-8">
            {person.photo_url ? (
              <img
                src={person.photo_url}
                alt={`${person.first_name} ${person.last_name}`}
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-forest/10 shadow-lg">
                <span className="font-display text-3xl font-bold text-forest">
                  {person.first_name.charAt(0)}
                  {person.last_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-forest sm:text-4xl">
              {person.first_name}{" "}
              {person.maiden_name && (
                <span className="text-forest/40">({person.maiden_name}) </span>
              )}
              {person.last_name}
            </h1>

            {lifespan && (
              <p className="mt-2 text-sm text-forest/60">{lifespan}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {person.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-forest/5 px-3 py-1 text-xs text-forest/70">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {person.location}
                </span>
              )}
              {person.occupation && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-xs text-gold-dark">
                  {person.occupation}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <section className="mb-10">
            <h2 className="mb-3 font-display text-xl font-semibold text-forest">
              About
            </h2>
            <p className="leading-relaxed text-forest/80">{person.bio}</p>
          </section>
        )}

        {/* Family connections */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-forest">
            Family
          </h2>
          <div className="space-y-4">
            {person.parents.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/40">
                  Parents
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.parents.map((p) => (
                    <PersonLink key={p.id} person={p} />
                  ))}
                </div>
              </div>
            )}

            {person.spouse && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/40">
                  Spouse
                </p>
                <PersonLink person={person.spouse} />
              </div>
            )}

            {person.siblings.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/40">
                  Siblings
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.siblings.map((s) => (
                    <PersonLink key={s.id} person={s} />
                  ))}
                </div>
              </div>
            )}

            {person.children.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-forest/40">
                  Children
                </p>
                <div className="flex flex-wrap gap-2">
                  {person.children.map((c) => (
                    <PersonLink key={c.id} person={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-forest">
            Photos
          </h2>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-forest/5"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Family photo"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-forest/10 py-12 text-center">
              <p className="text-sm text-forest/40">No photos yet</p>
            </div>
          )}
        </section>

        {/* Stories */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-forest">
            Stories & Memories
          </h2>
          {stories.length > 0 ? (
            <div className="space-y-4">
              {stories.map((story) => (
                <article
                  key={story.id}
                  className="rounded-lg border border-forest/10 bg-white p-5"
                >
                  <h3 className="font-display text-lg font-semibold text-forest">
                    {story.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-forest/70">
                    {story.content}
                  </p>
                  {story.author_name && (
                    <p className="mt-3 text-xs italic text-gold">
                      — {story.author_name}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-forest/10 py-12 text-center">
              <p className="text-sm text-forest/40">
                No stories yet — memories will appear here
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
