import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";

import { PRODUCTS, STRIPE_API_VERSION, getCatalogProduct } from "../src/data/catalog.ts";
import type { CartLineItem } from "../src/types/storefront.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 8787);
const allowedCountries = (process.env.ALLOWED_COUNTRIES || "US")
  .split(",")
  .map((country) => country.trim().toUpperCase())
  .filter(Boolean);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment.");
}

const stripeMode =
  stripeSecretKey.startsWith("sk_live_")
    ? "live"
    : stripeSecretKey.startsWith("sk_test_")
      ? "test"
      : "unknown";

const stripeConfig: Stripe.StripeConfig = {
  // @ts-expect-error stripe-node's type union lags the newest API version.
  apiVersion: STRIPE_API_VERSION,
};

const stripe = new Stripe(stripeSecretKey, stripeConfig);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    products: PRODUCTS.length,
    stripeMode,
  });
});

app.post("/api/checkout", async (request, response) => {
  try {
    const items = Array.isArray(request.body?.items) ? (request.body.items as CartLineItem[]) : [];
    const origin =
      typeof request.body?.origin === "string" && request.body.origin.length > 0
        ? request.body.origin
        : "http://localhost:8080";

    if (items.length === 0) {
      return response.status(400).json({
        error: "Your bag is empty.",
      });
    }

    const lineItems = items.map((item) => {
      const product = getCatalogProduct(item.productId);

      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }

      return {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.images[0]],
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      billing_address_collection: "required",
      customer_creation: "always",
      line_items: lineItems,
      locale: "auto",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: allowedCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Free shipping",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
          },
        },
      ],
      submit_type: "pay",
      metadata: {
        source: "scrapwrk-storefront",
        product_ids: items.map((item) => item.productId).join(","),
      },
    });

    return response.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";

    return response.status(500).json({
      error: message,
    });
  }
});

app.get("/api/checkout-session", async (request, response) => {
  try {
    const sessionId = String(request.query.session_id || "");

    if (!sessionId) {
      return response.status(400).json({
        error: "Missing session_id.",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 10,
    });

    return response.json({
      id: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email || session.customer_email || null,
      paymentStatus: session.payment_status,
      shippingName: session.shipping_details?.name || null,
      shippingAddress: session.shipping_details?.address
        ? {
            city: session.shipping_details.address.city,
            country: session.shipping_details.address.country,
            line1: session.shipping_details.address.line1,
            line2: session.shipping_details.address.line2,
            postalCode: session.shipping_details.address.postal_code,
            state: session.shipping_details.address.state,
          }
        : null,
      items: lineItems.data.map((item) => ({
        amountTotal: item.amount_total,
        currency: item.currency,
        description: item.description,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load checkout session.";

    return response.status(500).json({
      error: message,
    });
  }
});

app.listen(port, () => {
  console.log(
    `ScrapWRK API listening on http://localhost:${port} (Stripe mode: ${stripeMode})`,
  );
});
