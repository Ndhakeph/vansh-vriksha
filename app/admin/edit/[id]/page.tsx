import { notFound } from "next/navigation";
import Link from "next/link";
import { getPersonById, getAllPeople } from "@/lib/queries/people";
import { getAllRelationships } from "@/lib/queries/relationships";
import PersonForm from "@/components/admin/PersonForm";
import RelationshipManager from "@/components/admin/RelationshipManager";
import DeletePersonButton from "@/components/admin/DeletePersonButton";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const person = await getPersonById(params.id);
  if (!person) return { title: "Not Found | VanshVriksha Admin" };
  return {
    title: `Edit ${person.first_name} | VanshVriksha Admin`,
  };
}

export default async function EditPersonPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { new?: string };
}) {
  const [person, allPeople, allRelationships] = await Promise.all([
    getPersonById(params.id),
    getAllPeople(),
    getAllRelationships(),
  ]);

  if (!person) notFound();

  const personRelationships = allRelationships.filter(
    (r) => r.person_id === params.id || r.related_person_id === params.id
  );

  const isNew = searchParams.new === "1";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-forest">
          Edit: {person.first_name} {person.last_name}
        </h1>
        <Link
          href={`/person/${person.id}`}
          className="text-sm text-forest/50 hover:text-forest"
        >
          View Profile
        </Link>
      </div>

      {isNew && (
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Person added successfully! Now set up their relationships below.
        </div>
      )}

      <div className="space-y-6">
        <PersonForm person={person} mode="edit" />

        <RelationshipManager
          personId={person.id}
          allPeople={allPeople}
          existingRelationships={personRelationships}
        />

        <div className="rounded-xl border border-red-100 bg-white p-6">
          <h3 className="mb-2 font-display text-lg font-semibold text-red-700">
            Danger Zone
          </h3>
          <p className="mb-4 text-sm text-forest/50">
            Permanently delete this person and all their relationships, photos,
            and stories.
          </p>
          <DeletePersonButton
            personId={person.id}
            personName={`${person.first_name} ${person.last_name}`}
          />
        </div>
      </div>
    </div>
  );
}
