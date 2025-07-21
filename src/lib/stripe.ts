import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PRICING_PLANS = {
  PREMIUM: {
    name: 'Premium',
    price: 999, // $9.99 in cents
    interval: 'month' as const,
    features: [
      'Up to 50 GIFs per day',
      'Maximum 30 second clips',
      '1GB storage',
      'No watermark',
      'High quality (640px width)',
      'Priority processing',
      'Email support'
    ],
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
  },
  PRO: {
    name: 'Pro',
    price: 2999, // $29.99 in cents
    interval: 'month' as const,
    features: [
      'Unlimited GIFs per day',
      'Maximum 60 second clips',
      '10GB storage',
      'No watermark',
      'High quality (640px width)',
      'Priority processing',
      'API access',
      'Batch processing',
      'Advanced customization',
      'Priority support'
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
  }
} as const

export type PricingPlan = keyof typeof PRICING_PLANS

export function getPricingPlan(tier: string): typeof PRICING_PLANS[PricingPlan] | null {
  if (tier === 'PREMIUM' || tier === 'PRO') {
    return PRICING_PLANS[tier as PricingPlan]
  }
  return null
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export async function createOrRetrieveCustomer(email: string, userId: string): Promise<string> {
  // First, try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      userId: userId,
    },
  })

  return customer.id
}