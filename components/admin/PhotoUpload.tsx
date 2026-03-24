"use client";

import { useState, useRef, useCallback } from "react";

interface PhotoUploadProps {
  currentUrl?: string | null;
  onUpload: (url: string) => void;
}

function compressImage(file: File, maxSizeKB: number = 500): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      let { width, height } = img;
      const maxDim = 1200;

      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (blob && (blob.size <= maxSizeKB * 1024 || quality <= 0.3)) {
              resolve(blob);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };

    img.src = URL.createObjectURL(file);
  });
}

export default function PhotoUpload({ currentUrl, onUpload }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      setUploading(true);
      try {
        const compressed = await compressImage(file);
        setPreview(URL.createObjectURL(compressed));

        const formData = new FormData();
        formData.append("file", compressed, file.name);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const { url } = await res.json();
        onUpload(url);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-forest">
        Photo
      </label>
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragOver
            ? "border-gold bg-gold/5"
            : "border-forest/20 hover:border-forest/40"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-forest/5">
            <svg
              className="h-8 w-8 text-forest/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.324 4.5 4.5 0 013.112 8.1"
              />
            </svg>
          </div>
        )}
        <p className="mt-3 text-xs text-forest/50">
          {uploading
            ? "Uploading..."
            : "Drag & drop or click to upload a photo"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
