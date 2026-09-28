import AboutOverlay from "@/components/AboutOverlay";
import BrandText from "@/components/BrandText";
import ContactOverlay from "@/components/ContactOverlay";
import PrivacyOverlay from "@/components/PrivacyOverlay";
import TermsOverlay from "@/components/TermsOverlay";
import CartDrawer from "@/components/store/CartDrawer";
import ProductGallery from "@/components/store/ProductGallery";
import SEO from "@/components/SEO";
import { PRODUCTS, PRODUCT_MAP } from "@/data/catalog";
import { createCheckoutSession } from "@/lib/checkout";
import { formatCurrency } from "@/lib/utils";
import type { CartLineItem, StoreProduct } from "@/types/storefront";
import {
  ArrowRight,
  Info,
  Mail,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const CART_STORAGE_KEY = "scrapwrk-cart";

const loadCart = (): CartLineItem[] => {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!rawCart) {
      return [];
    }

    const parsedCart = JSON.parse(rawCart) as CartLineItem[];

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter((item) => PRODUCT_MAP[item.productId]);
  } catch {
    return [];
  }
};

type CheckoutState =
  | { kind: "idle" }
  | { kind: "single"; productId: string }
  | { kind: "cart" };

const ProductCard = ({
  isInBag,
  isProcessing,
  onAddToBag,
  onBuyNow,
  product,
  prioritize = false,
}: {
  isInBag: boolean;
  isProcessing: boolean;
  onAddToBag: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  product: StoreProduct;
  prioritize?: boolean;
}) => {
  return (
    <article className="surface-card flex h-full flex-col p-4 sm:p-5">
      <ProductGallery images={product.images} name={product.name} prioritize={prioritize} />

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
              {product.availabilityLabel}
            </p>
            <BrandText
              as="h2"
              className="mt-2 text-2xl font-bold text-stone-950"
              text={product.name}
            />
          </div>
          <p className="text-lg font-semibold text-stone-950">{formatCurrency(product.price)}</p>
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-600">{product.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 rounded-[24px] border border-stone-200 bg-stone-50 p-4 text-sm">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Size
            </p>
            <p className="mt-1 font-medium text-stone-950">{product.size}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Material
            </p>
            <p className="mt-1 font-medium text-stone-950">{product.material}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">
              Availability
            </p>
            <p className="mt-1 font-medium text-stone-950">{product.availabilityLabel}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-3 text-sm text-stone-700">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-stone-950" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="cta-primary"
            disabled={isProcessing}
            onClick={() => onBuyNow(product.id)}
          >
            {isProcessing ? "Redirecting..." : "Buy now"}
          </button>
          <button
            type="button"
            className="cta-secondary"
            disabled={isInBag || isProcessing}
            onClick={() => onAddToBag(product.id)}
          >
            {isInBag ? "In bag" : "Add to bag"}
          </button>
        </div>
      </div>
    </article>
  );
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const preloadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [cartItems, setCartItems] = useState<CartLineItem[]>(() => loadCart());
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ kind: "idle" });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCancelledNotice, setShowCancelledNotice] = useState(false);

  const cartCount = cartItems.length;
  const isCheckoutCancelled = searchParams.get("checkout") === "cancelled";

  const bagProducts = useMemo(() => {
    return cartItems
      .map((item) => PRODUCT_MAP[item.productId])
      .filter((product): product is StoreProduct => Boolean(product));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const preloadImages = (
      imageSources: string[],
      priority: "high" | "low" | "auto",
    ) => {
      imageSources.forEach((imageSource) => {
        if (!imageSource || preloadedImagesRef.current.has(imageSource)) {
          return;
        }

        const preload = new Image();
        preload.decoding = priority === "high" ? "sync" : "async";
        (
          preload as HTMLImageElement & {
            fetchPriority?: "high" | "low" | "auto";
          }
        ).fetchPriority = priority;
        preload.src = imageSource;
        preloadedImagesRef.current.set(imageSource, preload);
      });
    };

    const featuredImages = PRODUCTS[0]?.images ?? [];
    const coverImages = PRODUCTS.slice(1)
      .map((product) => product.images[0])
      .filter(Boolean);
    const deferredImages = PRODUCTS.flatMap((product, productIndex) =>
      product.images.filter((image, imageIndex) => {
        if (productIndex === 0) {
          return false;
        }

        return imageIndex > 0;
      }),
    );

    preloadImages(featuredImages, "high");
    preloadImages(coverImages, "auto");

    const deferRemainingImages = () => {
      preloadImages(deferredImages, "low");
    };

    if ("requestIdleCallback" in window) {
      const idleCallbackId = window.requestIdleCallback(deferRemainingImages);

      return () => window.cancelIdleCallback(idleCallbackId);
    }

    const timeoutId = window.setTimeout(deferRemainingImages, 240);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isCheckoutCancelled) {
      return;
    }

    setShowCancelledNotice(true);
  }, [isCheckoutCancelled]);

  const beginCheckout = async (
    items: CartLineItem[],
    state: CheckoutState,
  ) => {
    try {
      setCheckoutState(state);
      const session = await createCheckoutSession(items);
      window.location.assign(session.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
      setCheckoutState({ kind: "idle" });
    }
  };

  const handleAddToBag = (productId: string) => {
    setCartItems((currentItems) => {
      if (currentItems.some((item) => item.productId === productId)) {
        return currentItems;
      }

      return [...currentItems, { productId, quantity: 1 }];
    });

    setIsCartOpen(true);
    toast.success("Added to bag.");
  };

  const handleRemoveFromBag = (productId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const handleBuyNow = (productId: string) => {
    void beginCheckout([{ productId, quantity: 1 }], {
      kind: "single",
      productId,
    });
  };

  const handleCartCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    void beginCheckout(cartItems, { kind: "cart" });
  };

  return (
    <>
      <SEO
        title="ScrapWRK by Bryton Zoz | Sustainable Fashion from Scraps"
        description="ScrapWRK by Bryton Zoz transforms textile scraps into one-of-a-kind sustainable fashion pieces. Designed for those sustainably living in tomorrow."
        keywords="Bryton Zoz, ScrapWRK, sustainable fashion, upcycled clothing, textile scraps, fashion design, Bryton, Zoz"
      />

      <main className="min-h-screen bg-[var(--paper)] pb-10">
        <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[rgba(244,239,232,0.92)] backdrop-blur-md">
          <div className="page-shell flex items-center justify-between py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Bryton Zoz
              </p>
              <BrandText
                as="h1"
                className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl"
                text="SCRAPWRK"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="cta-secondary hidden sm:inline-flex"
                onClick={() => setShowContact(true)}
              >
                Contact
              </button>
              <button
                type="button"
                className="cta-primary"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Bag {cartCount > 0 ? `(${cartCount})` : ""}
              </button>
            </div>
          </div>
        </header>

        {showCancelledNotice && (
          <div className="pointer-events-none fixed inset-x-0 top-[5.75rem] z-40 px-4 sm:top-24 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4 rounded-[24px] border border-amber-300 bg-amber-50/95 px-4 py-3 text-sm text-amber-900 shadow-[0_20px_50px_rgba(120,53,15,0.12)] backdrop-blur-sm pointer-events-auto sm:px-5 sm:py-4">
              <p className="pr-2 leading-6">Checkout was cancelled. Your bag is still saved.</p>
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-white/70 text-amber-900 transition hover:bg-white"
                onClick={() => setShowCancelledNotice(false)}
                aria-label="Dismiss checkout cancelled notice"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <section className="page-shell pt-6 sm:pt-8">
          <div className="surface-card overflow-hidden p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  Available now
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-none text-stone-950 sm:text-5xl">
                  <BrandText as="span" className="block" text="SCRAPWRK by" />
                  <span className="block">Bryton Zoz</span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  ScrapWRK by Bryton Zoz transforms textile scraps into one-of-a-kind
                  sustainable fashion pieces. Designed for those sustainably living in
                  tomorrow.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex h-full flex-col rounded-[24px] border border-stone-200 bg-white p-3 sm:p-4">
                  <Truck className="h-5 w-5 text-stone-950" />
                  <p className="mt-3 text-xs font-medium leading-snug text-stone-950 sm:text-sm">
                    Free shipping
                  </p>
                </div>
                <div className="flex h-full flex-col rounded-[24px] border border-stone-200 bg-white p-3 sm:p-4">
                  <ShoppingBag className="h-5 w-5 text-stone-950" />
                  <p className="mt-3 text-xs font-medium leading-snug text-stone-950 sm:text-sm">
                    Direct-to-consumer checkout
                  </p>
                </div>
                <div className="flex h-full flex-col rounded-[24px] border border-stone-200 bg-white p-3 sm:p-4">
                  <Mail className="h-5 w-5 text-stone-950" />
                  <button
                    type="button"
                    className="mt-3 text-left text-xs font-medium leading-snug text-stone-950 sm:text-sm"
                    onClick={() => setShowAbout(true)}
                  >
                    Brand details and policies
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pt-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Shop
              </p>
              <h2 className="mt-2 text-2xl font-bold text-stone-950 sm:text-3xl">
                Current pieces
              </h2>
            </div>

            <button
              type="button"
              className="cta-secondary hidden sm:inline-flex"
              onClick={() => setIsCartOpen(true)}
            >
              View bag
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {PRODUCTS.map((product, index) => {
              const isInBag = cartItems.some((item) => item.productId === product.id);
              const isProcessing =
                checkoutState.kind === "single" && checkoutState.productId === product.id;

              return (
                <ProductCard
                  key={product.id}
                  isInBag={isInBag}
                  isProcessing={isProcessing}
                  onAddToBag={handleAddToBag}
                  onBuyNow={handleBuyNow}
                  product={product}
                  prioritize={index === 0}
                />
              );
            })}
          </div>
        </section>

        <footer className="page-shell pt-8">
          <div className="surface-card flex flex-col gap-6 p-5 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  Contact
                </p>
                <p className="mt-2 text-lg font-semibold text-stone-950">
                  bryton.p.zoz@gmail.com
                </p>
                <p className="mt-1 text-sm text-stone-600">+1 (469) 651-2656</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => setShowAbout(true)}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </button>
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => setShowContact(true)}
                >
                  Contact
                </button>
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => setShowPrivacy(true)}
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => setShowTerms(true)}
                >
                  Terms of Service
                </button>
              </div>
            </div>

            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              © {new Date().getFullYear()} <BrandText text="SCRAPWRK" />. All rights reserved.
            </p>
          </div>
        </footer>

        <CartDrawer
          isOpen={isCartOpen}
          items={cartItems}
          isCheckingOut={checkoutState.kind === "cart"}
          onCheckout={handleCartCheckout}
          onClose={() => setIsCartOpen(false)}
          onRemove={handleRemoveFromBag}
          productsById={PRODUCT_MAP}
        />

        <AboutOverlay isOpen={showAbout} onClose={() => setShowAbout(false)} />
        <ContactOverlay isOpen={showContact} onClose={() => setShowContact(false)} />
        <PrivacyOverlay isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        <TermsOverlay isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </main>
    </>
  );
};

export default Index;
