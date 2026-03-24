import Link from "next/link";
import { getAllPeople } from "@/lib/queries/people";

export default async function AdminDashboardPage() {
  const people = await getAllPeople();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-forest">
            Dashboard
          </h1>
          <p className="text-sm text-forest/50">
            {people.length} {people.length === 1 ? "person" : "people"} in the
            family tree
          </p>
        </div>
        <Link href="/admin/add" className="btn-primary">
          + Add New Person
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-forest/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-forest/10 bg-forest/[0.02]">
              <th className="px-4 py-3 font-medium text-forest/60">Name</th>
              <th className="px-4 py-3 font-medium text-forest/60">
                Generation
              </th>
              <th className="px-4 py-3 font-medium text-forest/60">
                Birth Year
              </th>
              <th className="px-4 py-3 font-medium text-forest/60">Gender</th>
              <th className="px-4 py-3 text-right font-medium text-forest/60">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr
                key={person.id}
                className="border-b border-forest/5 last:border-0 hover:bg-cream/50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/person/${person.id}`}
                    className="font-medium text-forest hover:text-gold-dark"
                  >
                    {person.first_name} {person.last_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-forest/60">
                  Gen {person.generation}
                </td>
                <td className="px-4 py-3 text-forest/60">
                  {person.birth_date
                    ? new Date(person.birth_date).getFullYear()
                    : "—"}
                </td>
                <td className="px-4 py-3 capitalize text-forest/60">
                  {person.gender}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/edit/${person.id}`}
                    className="rounded-lg px-3 py-1 text-xs text-forest/50 transition-colors hover:bg-forest/5 hover:text-forest"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-forest/40"
                >
                  No people yet. Add your first family member!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
