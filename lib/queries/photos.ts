import { createClient } from "@/lib/supabase/server";
import type { Photo } from "@/types/database";

export async function getPhotosByPerson(personId: string): Promise<Photo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("person_id", personId)
    .order("year", { ascending: false });

  if (error) throw error;
  return (data as Photo[]) ?? [];
}

export async function addPhoto(
  photo: Omit<Photo, "id" | "created_at">
): Promise<Photo> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photos")
    .insert(photo)
    .select()
    .single();

  if (error) throw error;
  return data as Photo;
}

export async function deletePhoto(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw error;
}
