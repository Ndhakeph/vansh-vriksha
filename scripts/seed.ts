import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const people = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    first_name: "Vishwanath",
    last_name: "Dhakephalkar",
    birth_date: "1910-01-01",
    death_date: "1985-06-15",
    gender: "male" as const,
    photo_url: null,
    bio: "The patriarch of the Dhakephalkar family. A respected figure in the community who laid the foundation for generations to come.",
    occupation: "Teacher",
    generation: 0,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    first_name: "Kamal",
    last_name: "Dhakephalkar",
    birth_date: "1915-03-10",
    death_date: "1990-11-20",
    gender: "female" as const,
    photo_url: null,
    bio: "Wife of Vishwanath. Known for her warmth and the way she held the family together.",
    occupation: null,
    generation: 0,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    first_name: "Ramesh",
    last_name: "Dhakephalkar",
    birth_date: "1938-07-22",
    death_date: null,
    gender: "male" as const,
    photo_url: null,
    bio: "Eldest son of Vishwanath. Carried forward the family tradition of education.",
    occupation: "Engineer",
    generation: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    first_name: "Suresh",
    last_name: "Dhakephalkar",
    birth_date: "1941-02-14",
    death_date: null,
    gender: "male" as const,
    photo_url: null,
    bio: "Second son of Vishwanath. Known for his adventurous spirit.",
    occupation: "Doctor",
    generation: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    first_name: "Mangesh",
    last_name: "Dhakephalkar",
    birth_date: "1944-09-05",
    death_date: null,
    gender: "male" as const,
    photo_url: null,
    bio: "Third son of Vishwanath. Built a successful business from the ground up.",
    occupation: "Businessman",
    generation: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    first_name: "Anita",
    last_name: "Dhakephalkar",
    birth_date: "1942-05-18",
    death_date: null,
    gender: "female" as const,
    photo_url: null,
    bio: "Wife of Ramesh. A pillar of strength in the family.",
    occupation: "Homemaker",
    generation: 1,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    first_name: "Priya",
    last_name: "Dhakephalkar",
    birth_date: "1965-11-30",
    death_date: null,
    gender: "female" as const,
    photo_url: null,
    bio: "Daughter of Ramesh and Anita. First in the family to study abroad.",
    occupation: "Software Engineer",
    generation: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    first_name: "Amit",
    last_name: "Dhakephalkar",
    birth_date: "1968-04-12",
    death_date: null,
    gender: "male" as const,
    photo_url: null,
    bio: "Son of Suresh. Followed his father into medicine.",
    occupation: "Cardiologist",
    generation: 2,
  },
];

const relationships = [
  // Vishwanath & Kamal are spouses
  {
    person_id: "00000000-0000-0000-0000-000000000001",
    related_person_id: "00000000-0000-0000-0000-000000000002",
    relationship_type: "spouse" as const,
  },
  // Ramesh & Anita are spouses
  {
    person_id: "00000000-0000-0000-0000-000000000003",
    related_person_id: "00000000-0000-0000-0000-000000000006",
    relationship_type: "spouse" as const,
  },
  // Vishwanath → Ramesh (parent → child)
  {
    person_id: "00000000-0000-0000-0000-000000000001",
    related_person_id: "00000000-0000-0000-0000-000000000003",
    relationship_type: "parent_child" as const,
  },
  // Vishwanath → Suresh
  {
    person_id: "00000000-0000-0000-0000-000000000001",
    related_person_id: "00000000-0000-0000-0000-000000000004",
    relationship_type: "parent_child" as const,
  },
  // Vishwanath → Mangesh
  {
    person_id: "00000000-0000-0000-0000-000000000001",
    related_person_id: "00000000-0000-0000-0000-000000000005",
    relationship_type: "parent_child" as const,
  },
  // Ramesh → Priya (parent → child)
  {
    person_id: "00000000-0000-0000-0000-000000000003",
    related_person_id: "00000000-0000-0000-0000-000000000007",
    relationship_type: "parent_child" as const,
  },
  // Suresh → Amit (parent → child)
  {
    person_id: "00000000-0000-0000-0000-000000000004",
    related_person_id: "00000000-0000-0000-0000-000000000008",
    relationship_type: "parent_child" as const,
  },
];

async function seed() {
  console.log("Seeding database...\n");

  // Clear existing data (order matters for foreign keys)
  console.log("Clearing existing data...");
  await supabase.from("stories").delete().neq("id", "");
  await supabase.from("photos").delete().neq("id", "");
  await supabase.from("relationships").delete().neq("id", "");
  await supabase.from("people").delete().neq("id", "");

  // Insert people
  console.log(`Inserting ${people.length} people...`);
  const { error: peopleError } = await supabase.from("people").insert(people);
  if (peopleError) {
    console.error("Error inserting people:", peopleError);
    process.exit(1);
  }

  // Insert relationships
  console.log(`Inserting ${relationships.length} relationships...`);
  const { error: relError } = await supabase
    .from("relationships")
    .insert(relationships);
  if (relError) {
    console.error("Error inserting relationships:", relError);
    process.exit(1);
  }

  console.log("\nSeed complete!");
  console.log(`  ${people.length} people`);
  console.log(`  ${relationships.length} relationships`);
  console.log("\nFamily structure:");
  console.log("  Vishwanath (Gen 0) & Kamal");
  console.log("    ├── Ramesh (Gen 1) & Anita");
  console.log("    │   └── Priya (Gen 2)");
  console.log("    ├── Suresh (Gen 1)");
  console.log("    │   └── Amit (Gen 2)");
  console.log("    └── Mangesh (Gen 1)");
}

seed().catch(console.error);
