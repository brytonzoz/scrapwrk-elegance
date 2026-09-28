import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  prioritize?: boolean;
}

const ProductGallery = ({ images, name, prioritize = false }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[24px] border border-stone-200 bg-stone-100">
        <div className="aspect-[4/5]">
          <img
            src={activeImage}
            alt={name}
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority={prioritize ? "high" : "auto"}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-stone-900 shadow-sm transition hover:bg-white"
              onClick={showPrevious}
              aria-label={`Show previous ${name} image`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-stone-900 shadow-sm transition hover:bg-white"
              onClick={showNext}
              aria-label={`Show next ${name} image`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={image}
              type="button"
              className={`shrink-0 overflow-hidden rounded-2xl border transition ${
                isActive
                  ? "border-stone-950 shadow-[0_10px_24px_rgba(28,25,23,0.12)]"
                  : "border-stone-200 opacity-70 hover:opacity-100"
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${name} image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                loading="eager"
                fetchPriority={prioritize && index < 2 ? "high" : "low"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;
