"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePersonButtonProps {
  personId: string;
  personName: string;
}

export default function DeletePersonButton({
  personId,
  personName,
}: DeletePersonButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/people/${personId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        Delete Person
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-red-600">
        Delete <strong>{personName}</strong>? This cannot be undone.
      </p>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Yes, Delete"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-lg px-4 py-2 text-sm text-forest/50 hover:text-forest"
      >
        Cancel
      </button>
    </div>
  );
}
