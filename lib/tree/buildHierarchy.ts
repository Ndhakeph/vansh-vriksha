import type { Person, Relationship, TreeNode } from "@/types/database";

export function buildHierarchy(
  people: Person[],
  relationships: Relationship[]
): TreeNode | null {
  if (people.length === 0) return null;

  const peopleById = new Map<string, Person>();
  for (const person of people) {
    peopleById.set(person.id, person);
  }

  // Build parent→children map from parent_child relationships
  // person_id = parent, related_person_id = child
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();
  const spouseMap = new Map<string, string>();

  for (const rel of relationships) {
    if (rel.relationship_type === "parent_child") {
      const parentId = rel.person_id;
      const childId = rel.related_person_id;

      if (!childrenMap.has(parentId)) childrenMap.set(parentId, []);
      childrenMap.get(parentId)!.push(childId);

      if (!parentMap.has(childId)) parentMap.set(childId, []);
      parentMap.get(childId)!.push(parentId);
    } else if (rel.relationship_type === "spouse") {
      spouseMap.set(rel.person_id, rel.related_person_id);
      spouseMap.set(rel.related_person_id, rel.person_id);
    }
  }

  // Find root: generation 0, or the person with no parents
  let root = people.find((p) => p.generation === 0);
  if (!root) {
    root = people.find((p) => !parentMap.has(p.id));
  }
  if (!root) {
    root = people[0];
  }

  // Track which children we've already placed to avoid duplicates
  // (a child with two parents should only appear once)
  const placed = new Set<string>();

  function buildNode(personId: string): TreeNode {
    const person = peopleById.get(personId)!;
    placed.add(personId);

    const spouseId = spouseMap.get(personId);
    const spouse = spouseId ? peopleById.get(spouseId) ?? null : null;

    // Collect children from this person AND their spouse, deduplicated
    const directChildren = childrenMap.get(personId) ?? [];
    const spouseChildren = spouseId
      ? (childrenMap.get(spouseId) ?? [])
      : [];
    const allChildIds = Array.from(new Set([...directChildren, ...spouseChildren]));

    const children: TreeNode[] = allChildIds
      .filter((childId) => !placed.has(childId) && peopleById.has(childId))
      .map((childId) => buildNode(childId));

    return {
      id: person.id,
      name: `${person.first_name} ${person.last_name}`,
      person,
      spouse,
      children,
    };
  }

  return buildNode(root.id);
}
