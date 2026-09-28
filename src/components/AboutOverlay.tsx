import BrandText, { accentBrandText } from "@/components/BrandText";
import OverlayShell from "@/components/overlays/OverlayShell";
import { PRODUCTS } from "@/data/catalog";
import { Leaf, Scissors, Sparkles } from "lucide-react";

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutOverlay = ({ isOpen, onClose }: AboutOverlayProps) => {
  const aboutImage = PRODUCTS[0]?.images[0];

  return (
    <OverlayShell
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={<BrandText text="ScrapWRK" />}
      title={accentBrandText("About ScrapWRK")}
      description="The brand story, process, and philosophy behind the current collection."
      meta={
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Focus
            </p>
            <p className="mt-2 text-sm font-medium text-stone-950">
              Sustainable manufacturing
            </p>
          </div>
          <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Output
            </p>
            <p className="mt-2 text-sm font-medium text-stone-950">
              Unique limited editions
            </p>
          </div>
          <div className="rounded-[24px] border border-stone-200 bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Method
            </p>
            <p className="mt-2 text-sm font-medium text-stone-950">
              Zero-waste philosophy
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Our Mission
            </p>
            <div className="mt-4 space-y-4 text-sm leading-6 text-stone-700 sm:text-base">
              <p>
                {accentBrandText(
                  "SCRAPWRK was founded with a simple yet powerful mission: to transform textile waste into limited edition, one-of-a-kind fashion pieces that challenge conventional design.",
                )}
              </p>
              <p>
                Each piece in our collection is meticulously crafted from hundreds of textile
                scraps that would otherwise end up in landfills.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                    <Leaf className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-stone-950">
                    Sustainable Manufacturing
                  </span>
                </div>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-stone-950">
                    Unique Limited Editions
                  </span>
                </div>
              </div>
              <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                    <Scissors className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-stone-950">
                    Zero-Waste Philosophy
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card overflow-hidden">
            <div className="aspect-[4/5] bg-stone-100">
              <img
                src={aboutImage}
                alt="SCRAPWRK design process"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <section className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Design Process
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
              Our design process begins with sourcing textile waste from local manufacturers.
              These materials are then sorted, cleaned, and categorized before our designers
              begin the creative transformation.
            </p>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Materials
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
              We work with a wide range of materials, from denim scraps to high-end textile
              waste. Each material brings its own unique texture, weight, and story,
              contributing to the distinctive character of each piece.
            </p>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              Craftsmanship
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-700 sm:text-base">
              {accentBrandText(
                "All SCRAPWRK pieces are handcrafted in our studio. Our skilled artisans combine traditional craftsmanship with innovative techniques to create durable, high-quality garments that are designed to last.",
              )}
            </p>
          </section>
        </div>
      </div>
    </OverlayShell>
  );
};

export default AboutOverlay;
