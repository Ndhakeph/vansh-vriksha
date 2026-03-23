export interface Person {
  id: string;
  first_name: string;
  last_name: string;
  maiden_name: string | null;
  date_of_birth: string | null;
  date_of_death: string | null;
  gender: "male" | "female";
  photo_url: string | null;
  bio: string | null;
  location: string | null;
  occupation: string | null;
  generation: number;
  branch_color: string | null;
  created_at: string;
  updated_at: string;
}

export type RelationshipType = "parent_child" | "spouse";

export interface Relationship {
  id: string;
  person_id: string;
  related_person_id: string;
  relationship_type: RelationshipType;
  created_at: string;
}

export interface Photo {
  id: string;
  person_id: string;
  url: string;
  caption: string | null;
  year: number | null;
  created_at: string;
}

export interface Story {
  id: string;
  person_id: string;
  title: string;
  content: string;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface PersonWithRelations extends Person {
  parents: Person[];
  spouse: Person | null;
  children: Person[];
  siblings: Person[];
}

export interface TreeNode {
  id: string;
  name: string;
  person: Person;
  spouse: Person | null;
  children: TreeNode[];
}

export interface Database {
  public: {
    Tables: {
      people: {
        Row: Person;
        Insert: Omit<Person, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Person, "id" | "created_at" | "updated_at">>;
      };
      relationships: {
        Row: Relationship;
        Insert: Omit<Relationship, "id" | "created_at">;
        Update: Partial<Omit<Relationship, "id" | "created_at">>;
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, "id" | "created_at">;
        Update: Partial<Omit<Photo, "id" | "created_at">>;
      };
      stories: {
        Row: Story;
        Insert: Omit<Story, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Story, "id" | "created_at" | "updated_at">>;
      };
    };
  };
}
