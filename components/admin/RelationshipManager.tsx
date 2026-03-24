"use client";

import { useState } from "react";
import type { Person, Relationship } from "@/types/database";

interface RelationshipManagerProps {
  personId: string;
  allPeople: Person[];
  existingRelationships?: Relationship[];
}

export default function RelationshipManager({
  personId,
  allPeople,
  existingRelationships = [],
}: RelationshipManagerProps) {
  const [fatherId, setFatherId] = useState(() => {
    const rel = existingRelationships.find(
      (r) =>
        r.relationship_type === "parent_child" &&
        r.related_person_id === personId
    );
    if (rel) {
      const parent = allPeople.find((p) => p.id === rel.person_id);
      if (parent?.gender === "male") return rel.person_id;
    }
    return "";
  });

  const [motherId, setMotherId] = useState(() => {
    const rel = existingRelationships.find(
      (r) =>
        r.relationship_type === "parent_child" &&
        r.related_person_id === personId &&
        (() => {
          const parent = allPeople.find((p) => p.id === r.person_id);
          return parent?.gender === "female";
        })()
    );
    return rel?.person_id || "";
  });

  const [spouseId, setSpouseId] = useState(() => {
    const rel = existingRelationships.find(
      (r) =>
        r.relationship_type === "spouse" &&
        (r.person_id === personId || r.related_person_id === personId)
    );
    if (!rel) return "";
    return rel.person_id === personId ? rel.related_person_id : rel.person_id;
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const males = allPeople.filter(
    (p) => p.gender === "male" && p.id !== personId
  );
  const females = allPeople.filter(
    (p) => p.gender === "female" && p.id !== personId
  );
  const otherPeople = allPeople.filter((p) => p.id !== personId);

  async function saveRelationships() {
    setSaving(true);
    setSaved(false);

    try {
      // Delete existing relationships for this person
      for (const rel of existingRelationships) {
        await fetch(`/api/relationships?id=${rel.id}`, { method: "DELETE" });
      }

      // Add father relationship (father is parent, personId is child)
      if (fatherId) {
        await fetch("/api/relationships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person_id: fatherId,
            related_person_id: personId,
            relationship_type: "parent_child",
          }),
        });
      }

      // Add mother relationship
      if (motherId) {
        await fetch("/api/relationships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person_id: motherId,
            related_person_id: personId,
            relationship_type: "parent_child",
          }),
        });
      }

      // Add spouse relationship
      if (spouseId) {
        await fetch("/api/relationships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person_id: personId,
            related_person_id: spouseId,
            relationship_type: "spouse",
          }),
        });
      }

      setSaved(true);
    } catch (err) {
      console.error("Error saving relationships:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-forest/10 bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-forest">
        Relationships
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Father
          </label>
          <select
            value={fatherId}
            onChange={(e) => setFatherId(e.target.value)}
            className="w-full rounded-lg border border-forest/20 bg-cream/50 px-3 py-2 text-sm text-forest outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">— None —</option>
            {males.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} (Gen {p.generation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Mother
          </label>
          <select
            value={motherId}
            onChange={(e) => setMotherId(e.target.value)}
            className="w-full rounded-lg border border-forest/20 bg-cream/50 px-3 py-2 text-sm text-forest outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">— None —</option>
            {females.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} (Gen {p.generation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Spouse
          </label>
          <select
            value={spouseId}
            onChange={(e) => setSpouseId(e.target.value)}
            className="w-full rounded-lg border border-forest/20 bg-cream/50 px-3 py-2 text-sm text-forest outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">— None —</option>
            {otherPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name} (Gen {p.generation})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={saveRelationships}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Relationships"}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Relationships saved!</span>
        )}
      </div>
    </div>
  );
}
