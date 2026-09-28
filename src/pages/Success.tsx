import BrandText, { accentBrandText } from "@/components/BrandText";
import { fetchCheckoutSession } from "@/lib/checkout";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const CART_STORAGE_KEY = "scrapwrk-cart";

const formatCents = (amount: number | null, currency?: string | null) => {
  if (amount === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.toUpperCase() || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof fetchCheckoutSession>
  > | null>(null);

  useEffect(() => {
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setError("Missing checkout session.");
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await fetchCheckoutSession(sessionId);

        if (isMounted) {
          setSession(response);
        }
      } catch (sessionError) {
        if (isMounted) {
          setError(
            sessionError instanceof Error
              ? sessionError.message
              : "Unable to load order details.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[var(--paper)] py-6 sm:py-10">
      <div className="page-shell">
        <div className="surface-card mx-auto max-w-3xl p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                  <BrandText text="ScrapWRK" />
                </p>
                <h1 className="mt-2 text-3xl font-bold text-stone-950 sm:text-4xl">
                  Order received
                </h1>
              </div>

              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-stone-50">
                <CheckCircle2 className="h-7 w-7" />
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Your payment completed through Stripe. A confirmation email will be sent to the
              address used at checkout.
            </p>

            {isLoading && (
              <div className="rounded-[24px] border border-stone-200 bg-white p-5 text-sm text-stone-600">
                Loading order details...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error}
              </div>
            )}

            {!isLoading && session && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-stone-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                      Contact
                    </p>
                    <p className="mt-2 text-sm font-medium text-stone-950">
                      {session.customerEmail || "Provided at checkout"}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-stone-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-2 text-sm font-medium text-stone-950">
                      {formatCents(session.amountTotal, session.currency) || formatCurrency(0)}
                    </p>
                  </div>
                </div>

                {session.shippingAddress && (
                  <div className="rounded-[24px] border border-stone-200 bg-white p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                      Ship to
                    </p>
                    <div className="mt-2 text-sm leading-6 text-stone-700">
                      {session.shippingName && <p>{session.shippingName}</p>}
                      {session.shippingAddress.line1 && <p>{session.shippingAddress.line1}</p>}
                      {session.shippingAddress.line2 && <p>{session.shippingAddress.line2}</p>}
                      <p>
                        {[
                          session.shippingAddress.city,
                          session.shippingAddress.state,
                          session.shippingAddress.postalCode,
                          session.shippingAddress.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-[24px] border border-stone-200 bg-white p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">
                    Items
                  </p>

                  <div className="mt-4 space-y-4">
                    {session.items.map((item, index) => (
                      <div
                        key={`${item.description}-${index}`}
                        className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-stone-950">
                            {accentBrandText(item.description)}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            Quantity: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-stone-950">
                          {formatCents(item.amountTotal, item.currency)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <Link className="cta-secondary w-full sm:w-auto" to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Success;
