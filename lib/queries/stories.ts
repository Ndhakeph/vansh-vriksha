import { createClient } from "@/lib/supabase/server";
import type { Story } from "@/types/database";

export async function getStoriesByPerson(personId: string): Promise<Story[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("person_id", personId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Story[]) ?? [];
}

export async function addStory(
  story: Omit<Story, "id" | "created_at" | "updated_at">
): Promise<Story> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .insert(story)
    .select()
    .single();

  if (error) throw error;
  return data as Story;
}

export async function updateStory(
  id: string,
  updates: Partial<Pick<Story, "title" | "content" | "author_name">>
): Promise<Story> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Story;
}

export async function deleteStory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("stories").delete().eq("id", id);
  if (error) throw error;
}
