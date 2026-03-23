import { createClient } from "@/lib/supabase/server";
import type { Person, PersonWithRelations, Relationship } from "@/types/database";

export async function getAllPeople(): Promise<Person[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .order("generation", { ascending: true });

  if (error) throw error;
  return (data as Person[]) ?? [];
}

export async function getPersonById(id: string): Promise<Person | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Person;
}

export async function getPersonWithRelations(
  id: string
): Promise<PersonWithRelations | null> {
  const supabase = createClient();

  const { data: personData, error: personError } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (personError) {
    if (personError.code === "PGRST116") return null;
    throw personError;
  }

  const person = personData as Person;

  const { data: relData, error: relError } = await supabase
    .from("relationships")
    .select("*")
    .or(`person_id.eq.${id},related_person_id.eq.${id}`);

  if (relError) throw relError;

  const relationships = (relData as Relationship[]) ?? [];
  const parentIds: string[] = [];
  const childIds: string[] = [];
  const spouseIds: string[] = [];

  for (const rel of relationships) {
    if (rel.relationship_type === "parent_child") {
      if (rel.related_person_id === id) {
        parentIds.push(rel.person_id);
      } else {
        childIds.push(rel.related_person_id);
      }
    } else if (rel.relationship_type === "spouse") {
      const spouseId =
        rel.person_id === id ? rel.related_person_id : rel.person_id;
      spouseIds.push(spouseId);
    }
  }

  const allRelatedIds = Array.from(new Set([...parentIds, ...childIds, ...spouseIds]));

  let relatedPeople: Person[] = [];
  if (allRelatedIds.length > 0) {
    const { data, error } = await supabase
      .from("people")
      .select("*")
      .in("id", allRelatedIds);
    if (error) throw error;
    relatedPeople = (data as Person[]) ?? [];
  }

  const byId = (ids: string[]) =>
    relatedPeople.filter((p) => ids.includes(p.id));

  let siblings: Person[] = [];
  if (parentIds.length > 0) {
    const { data: siblingRels } = await supabase
      .from("relationships")
      .select("related_person_id")
      .in("person_id", parentIds)
      .eq("relationship_type", "parent_child")
      .neq("related_person_id", id);

    const rels = (siblingRels as { related_person_id: string }[]) ?? [];
    if (rels.length > 0) {
      const siblingIds = Array.from(new Set(rels.map((r) => r.related_person_id)));
      const { data } = await supabase
        .from("people")
        .select("*")
        .in("id", siblingIds);
      siblings = (data as Person[]) ?? [];
    }
  }

  return {
    ...person,
    parents: byId(parentIds),
    spouse: byId(spouseIds)[0] ?? null,
    children: byId(childIds),
    siblings,
  };
}
