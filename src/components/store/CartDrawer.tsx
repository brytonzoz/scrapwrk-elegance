import BrandText from "@/components/BrandText";
import { formatCurrency } from "@/lib/utils";
import type { CartLineItem, StoreProduct } from "@/types/storefront";
import { ShoppingBag, Trash2, X } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  items: CartLineItem[];
  isCheckingOut: boolean;
  onCheckout: () => void;
  onClose: () => void;
  onRemove: (productId: string) => void;
  productsById: Record<string, StoreProduct>;
}

const CartDrawer = ({
  isOpen,
  items,
  isCheckingOut,
  onCheckout,
  onClose,
  onRemove,
  productsById,
}: CartDrawerProps) => {
  const cartProducts = items
    .map((item) => ({
      item,
      product: productsById[item.productId],
    }))
    .filter(
      (
        entry,
      ): entry is {
        item: CartLineItem;
        product: StoreProduct;
      } => Boolean(entry.product),
    );

  const total = cartProducts.reduce(
    (sum, entry) => sum + entry.product.price * entry.item.quantity,
    0,
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-stone-950/50 backdrop-blur-sm transition ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[28rem] flex-col border-l border-stone-200 bg-[rgba(247,243,236,0.97)] shadow-[0_24px_80px_rgba(28,25,23,0.18)] transition-transform duration-300 sm:rounded-l-[32px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-stone-50">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                Bag
              </p>
              <p className="text-base font-semibold text-stone-950">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-950 transition hover:border-stone-300 hover:bg-stone-100"
            onClick={onClose}
            aria-label="Close bag"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {cartProducts.length === 0 ? (
            <div className="surface-card flex h-full min-h-[16rem] flex-col items-center justify-center px-6 py-10 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                <ShoppingBag className="h-6 w-6" />
              </span>
              <p className="mt-4 text-lg font-semibold text-stone-950">Your bag is empty.</p>
              <p className="mt-2 text-sm text-stone-600">
                Add a product and checkout directly with Stripe.
              </p>
            </div>
          ) : (
            cartProducts.map(({ item, product }) => (
              <div
                key={product.id}
                className="surface-card flex items-start gap-4 p-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-24 w-20 rounded-[18px] object-cover"
                  loading="eager"
                  fetchPriority="low"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                    {product.availabilityLabel}
                  </p>
                  <BrandText
                    as="h3"
                    className="mt-1 text-base font-semibold text-stone-950"
                    text={product.name}
                  />
                  <p className="mt-1 text-sm text-stone-600">{formatCurrency(product.price)}</p>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-950 transition hover:border-stone-300 hover:bg-stone-100"
                  onClick={() => onRemove(product.id)}
                  aria-label={`Remove ${product.name} from bag`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-stone-200 px-5 py-5">
          <div className="mb-4 flex items-center justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-950">{formatCurrency(total)}</span>
          </div>
          <div className="mb-6 flex items-center justify-between text-sm text-stone-600">
            <span>Shipping</span>
            <span className="font-semibold text-stone-950">Free</span>
          </div>

          <button
            type="button"
            className="cta-primary w-full"
            disabled={cartProducts.length === 0 || isCheckingOut}
            onClick={onCheckout}
          >
            {isCheckingOut ? "Redirecting to Stripe..." : "Checkout"}
          </button>

          <p className="mt-3 text-center text-xs text-stone-500">
            Secure checkout powered by Stripe.
          </p>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
