"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddStoryFormProps {
  personId: string;
}

export default function AddStoryForm({ personId }: AddStoryFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person_id: personId,
          title: title.trim(),
          content: content.trim(),
          author_name: authorName.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save story");

      setTitle("");
      setContent("");
      setAuthorName("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary text-sm"
      >
        + Add Story
      </button>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-forest/20 bg-cream/50 px-3 py-2 text-sm text-forest outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-forest/10 bg-white p-5"
    >
      <h3 className="mb-4 font-display text-lg font-semibold text-forest">
        Add a Story or Memory
      </h3>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            placeholder="e.g., The time we visited Pune together"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Story <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} h-32 resize-none`}
            placeholder="Share a memory, anecdote, or anything meaningful..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest">
            Your Name
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={inputClass}
            placeholder="Who is sharing this story?"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Story"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-forest/50 hover:text-forest"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
