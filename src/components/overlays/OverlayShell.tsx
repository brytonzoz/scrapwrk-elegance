import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface OverlayShellProps {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
}

const OverlayShell = ({
  isOpen,
  onClose,
  eyebrow,
  title,
  description,
  meta,
  children,
}: OverlayShellProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const closeLabel = typeof title === "string" ? `Close ${title}` : "Close panel";

  return (
    <div className="fixed inset-0 z-[60] p-4 sm:p-6 lg:p-8">
      <div
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-auto flex h-full w-full max-w-5xl items-center justify-center">
        <div className="surface-card flex max-h-full w-full flex-col overflow-hidden bg-[rgba(244,239,232,0.98)]">
          <div className="sticky top-0 z-10 border-b border-stone-200 bg-[rgba(244,239,232,0.96)] px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  {eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-none text-stone-950 sm:text-4xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="cta-secondary h-12 w-12 shrink-0 rounded-full px-0 py-0"
                onClick={onClose}
                aria-label={closeLabel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {meta && <div className="mt-4">{meta}</div>}
          </div>

          <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default OverlayShell;
