import type { CartLineItem } from "@/types/storefront";

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export interface CheckoutSessionDetails {
  id: string;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  paymentStatus: string | null;
  shippingName: string | null;
  shippingAddress: {
    city?: string | null;
    country?: string | null;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    state?: string | null;
  } | null;
  items: Array<{
    amountTotal: number | null;
    currency: string | null;
    description: string;
    quantity: number | null;
  }>;
}

const parseError = async (response: Response) => {
  try {
    const payload = await response.json();
    return payload.error || payload.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

export const createCheckoutSession = async (
  items: CartLineItem[],
): Promise<CheckoutSessionResponse> => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      origin: window.location.origin,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const fetchCheckoutSession = async (
  sessionId: string,
): Promise<CheckoutSessionDetails> => {
  const response = await fetch(
    `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
  );

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};
