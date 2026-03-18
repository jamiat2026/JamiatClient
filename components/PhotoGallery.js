"use client";
import { useState, useCallback, useEffect } from "react";
import { ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProjectGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    const currentIndex = images?.indexOf(selectedImage);
    if (currentIndex !== -1 && currentIndex !== undefined) {
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      setSelectedImage(images[prevIndex]);
    }
  }, [images, selectedImage]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    const currentIndex = images?.indexOf(selectedImage);
    if (currentIndex !== -1 && currentIndex !== undefined) {
      const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(images[nextIndex]);
    }
  }, [images, selectedImage]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImage(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handlePrev, handleNext]);

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
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-20"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {/* Prev button */}
          {images && images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-8 text-white/70 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          )}

          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-h-[85%] max-w-[85%] md:max-h-[90%] md:max-w-[90%] rounded-lg shadow-lg border-2 lg:border-8 border-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          {images && images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-8 text-white/70 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
