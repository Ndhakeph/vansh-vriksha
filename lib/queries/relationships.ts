import { createClient } from "@/lib/supabase/server";
import type { Person, Relationship } from "@/types/database";

export async function getAllRelationships(): Promise<Relationship[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("relationships").select("*");
  if (error) throw error;
  return (data as Relationship[]) ?? [];
}

export async function getParents(personId: string): Promise<Person[]> {
  const supabase = createClient();
  const { data: rels, error: relError } = await supabase
    .from("relationships")
    .select("person_id")
    .eq("related_person_id", personId)
    .eq("relationship_type", "parent_child");

  if (relError) throw relError;
  if (!rels || rels.length === 0) return [];

  const parentIds = (rels as { person_id: string }[]).map((r) => r.person_id);
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .in("id", parentIds);

  if (error) throw error;
  return (data as Person[]) ?? [];
}

export async function getChildren(personId: string): Promise<Person[]> {
  const supabase = createClient();
  const { data: rels, error: relError } = await supabase
    .from("relationships")
    .select("related_person_id")
    .eq("person_id", personId)
    .eq("relationship_type", "parent_child");

  if (relError) throw relError;
  if (!rels || rels.length === 0) return [];

  const childIds = (rels as { related_person_id: string }[]).map((r) => r.related_person_id);
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .in("id", childIds);

  if (error) throw error;
  return (data as Person[]) ?? [];
}

export async function getSpouse(personId: string): Promise<Person | null> {
  const supabase = createClient();
  const { data: rels, error: relError } = await supabase
    .from("relationships")
    .select("*")
    .eq("relationship_type", "spouse")
    .or(`person_id.eq.${personId},related_person_id.eq.${personId}`);

  if (relError) throw relError;
  const relationships = (rels as Relationship[]) ?? [];
  if (relationships.length === 0) return null;

  const spouseId =
    relationships[0].person_id === personId
      ? relationships[0].related_person_id
      : relationships[0].person_id;

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("id", spouseId)
    .single();

  if (error) return null;
  return data as Person;
}
