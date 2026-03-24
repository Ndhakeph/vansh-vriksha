import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { Person } from "@/types/database";

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const personData: Omit<Person, "id" | "created_at" | "updated_at"> = {
    first_name: body.first_name,
    last_name: body.last_name || "Dhakephalkar",
    gender: body.gender,
    birth_date: body.birth_date || null,
    death_date: body.death_date || null,
    photo_url: body.photo_url || null,
    bio: body.bio || null,
    occupation: body.occupation || null,
    generation: body.generation ?? 0,
  };

  const { data, error } = await supabase
    .from("people")
    .insert(personData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as Person);
}
