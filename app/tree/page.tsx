import { getAllPeople } from "@/lib/queries/people";
import { getAllRelationships } from "@/lib/queries/relationships";
import { buildHierarchy } from "@/lib/tree/buildHierarchy";
import FamilyTree from "@/components/tree/FamilyTree";
import Link from "next/link";

export const metadata = {
  title: "Family Tree | VanshVriksha",
};

export default async function TreePage() {
  let treeData = null;
  let error = null;

  try {
    const [people, relationships] = await Promise.all([
      getAllPeople(),
      getAllRelationships(),
    ]);
    treeData = buildHierarchy(people, relationships);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load family data";
  }

  return (
    <div className="flex h-screen flex-col bg-cream">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-forest/10 px-6 py-3">
        <Link
          href="/"
          className="font-display text-xl font-bold text-forest transition-colors hover:text-forest-light"
        >
          VanshVriksha
        </Link>
        <div className="flex items-center gap-2 text-sm text-forest/50">
          <span>Scroll to zoom</span>
          <span className="text-gold">|</span>
          <span>Drag to pan</span>
          <span className="text-gold">|</span>
          <span>Click a node for details</span>
        </div>
      </header>

      {/* Tree */}
      <main className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-forest">
                Could not load the family tree
              </p>
              <p className="text-sm text-forest/60">{error}</p>
            </div>
          </div>
        ) : !treeData ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-forest">
                No family data yet
              </p>
              <p className="text-sm text-forest/60">
                Add people to the database to see the tree.
              </p>
            </div>
          </div>
        ) : (
          <FamilyTree data={treeData} />
        )}
      </main>
    </div>
  );
}
