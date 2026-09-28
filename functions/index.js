const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || functions.config().stripe?.secret_key;
const stripe = stripeSecretKey ? require('stripe')(stripeSecretKey) : null;
const stripeMode = stripeSecretKey
  ? stripeSecretKey.startsWith('sk_live_')
    ? 'live'
    : stripeSecretKey.startsWith('sk_test_')
      ? 'test'
      : 'unknown'
  : 'missing';

const products = {
  'scrapwrk-001-hoodie': {
    name: 'SCRAPWRK 001: HOODIE',
    price: 349,
    description:
      'One-of-a-kind handcrafted hoodie made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.',
    image:
      'https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev/hoodie%201.png',
  },
  'scrapwrk-002-pants': {
    name: 'SCRAPWRK 002: PANTS',
    price: 429,
    description:
      'Artisanal pants crafted from reclaimed textiles. Featuring unique patterns and textures, these pants offer comfort with sustainable style.',
    image:
      'https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev/panst1.png',
  },
  'scrapwrk-003-hat': {
    name: 'SCRAPWRK 003: HAT',
    price: 99,
    description:
      'Minimalist hat designed with purpose. Featuring a unique silhouette and crafted from recovered materials, each hat tells its own story.',
    image:
      'https://pub-0e7fc99fe226413f853855be2eddd12d.r2.dev/hat%201.png',
  },
};

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    products: Object.keys(products).length,
    stripeMode,
  });
});

app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const origin =
      typeof req.body?.origin === 'string' && req.body.origin.length > 0
        ? req.body.origin
        : 'https://scrapwrk.web.app';

    if (items.length === 0) {
      return res.status(400).json({ error: 'Your bag is empty.' });
    }

    const lineItems = items.map((item) => {
      const product = products[item.productId];

      if (!product) {
        throw new Error(`Unknown product: ${item.productId}`);
      }

      return {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.image],
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      billing_address_collection: 'required',
      customer_creation: 'always',
      line_items: lineItems,
      locale: 'auto',
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: 'Free shipping',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
          },
        },
      ],
      submit_type: 'pay',
      metadata: {
        source: 'scrapwrk-storefront',
        product_ids: items.map((item) => item.productId).join(','),
      },
    });

    return res.status(200).json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Unable to create checkout session.',
    });
  }
});

app.get('/api/checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const sessionId = String(req.query.session_id || '');

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id.' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 10,
    });

    return res.status(200).json({
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
    console.error('Error loading checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Unable to load checkout session.',
    });
  }
});

// Create payment intent route
app.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }

    const { amount, currency = 'usd' } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send publishable key and PaymentIntent details to client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export the API as a Firebase Cloud Function
exports.api = functions.https.onRequest(app); 
