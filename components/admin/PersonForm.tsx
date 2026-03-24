"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Person } from "@/types/database";
import PhotoUpload from "./PhotoUpload";

interface PersonFormProps {
  person?: Person;
  mode: "add" | "edit";
}

export default function PersonForm({ person, mode }: PersonFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: person?.first_name || "",
    last_name: person?.last_name || "Dhakephalkar",
    gender: person?.gender || "male",
    birth_date: person?.birth_date || "",
    death_date: person?.death_date || "",
    bio: person?.bio || "",
    occupation: person?.occupation || "",
    generation: person?.generation ?? 1,
    photo_url: person?.photo_url || "",
  });

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.first_name.trim()) {
      setError("First name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url =
        mode === "add" ? "/api/people" : `/api/people/${person!.id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const saved = await res.json();

      if (mode === "add") {
        router.push(`/admin/edit/${saved.id}?new=1`);
      } else {
        router.refresh();
        setError("");
        setSaving(false);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-forest/20 bg-cream/50 px-3 py-2 text-sm text-forest outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20";
  const labelClass = "mb-1 block text-sm font-medium text-forest";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-forest/10 bg-white p-6">
        <h3 className="mb-4 font-display text-lg font-semibold text-forest">
          Basic Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.first_name}
              onChange={(e) => update("first_name", e.target.value)}
              className={inputClass}
              placeholder="First name"
            />
          </div>

          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => update("last_name", e.target.value)}
              className={inputClass}
              placeholder="Dhakephalkar"
            />
          </div>

          <div>
            <label className={labelClass}>Gender</label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              className={inputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Generation</label>
            <select
              value={form.generation}
              onChange={(e) => update("generation", Number(e.target.value))}
              className={inputClass}
            >
              <option value={0}>Gen 0 (Great-grandparent)</option>
              <option value={1}>Gen 1 (Grandparent)</option>
              <option value={2}>Gen 2 (Parent)</option>
              <option value={3}>Gen 3 (Current)</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Birth Date</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => update("birth_date", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Death Date</label>
            <input
              type="date"
              value={form.death_date}
              onChange={(e) => update("death_date", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Occupation</label>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => update("occupation", e.target.value)}
              className={inputClass}
              placeholder="e.g., Teacher, Engineer"
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              className={`${inputClass} h-28 resize-none`}
              placeholder="A short biography or description..."
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-forest/10 bg-white p-6">
        <PhotoUpload
          currentUrl={form.photo_url || null}
          onUpload={(url) => update("photo_url", url)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : mode === "add"
            ? "Save Person"
            : "Update Person"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
