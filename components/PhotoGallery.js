"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

export default function ProjectGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className="w-full">
      {/* Grid gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group"
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`Gallery Image ${idx + 1}`}
              className="rounded-2xl aspect-square w-full object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg border-2 lg:border-8 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
