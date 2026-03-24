import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("people")
    .update({
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      birth_date: body.birth_date || null,
      death_date: body.death_date || null,
      photo_url: body.photo_url || null,
      bio: body.bio || null,
      occupation: body.occupation || null,
      generation: body.generation,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete relationships first (foreign key constraint)
  await supabase
    .from("relationships")
    .delete()
    .or(`person_id.eq.${params.id},related_person_id.eq.${params.id}`);

  // Delete photos
  await supabase.from("photos").delete().eq("person_id", params.id);

  // Delete stories
  await supabase.from("stories").delete().eq("person_id", params.id);

  // Delete person
  const { error } = await supabase
    .from("people")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
