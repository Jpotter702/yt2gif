import { stripe, createOrRetrieveCustomer, PRICING_PLANS, PricingPlan } from './stripe'
import { prisma } from './prisma'

export class SubscriptionManager {
  async createCheckoutSession(userId: string, email: string, plan: PricingPlan) {
    if (!stripe) {
      throw new Error('Stripe not configured')
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Get or create Stripe customer
      const customerId = user.stripeCustomerId || await createOrRetrieveCustomer(email, userId)

      // Update user with customer ID if not already set
      if (!user.stripeCustomerId) {
        await prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        })
      }

      const pricingPlan = PRICING_PLANS[plan]
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
          {
            price: pricingPlan.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          metadata: {
            userId: userId,
          },
        },
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXTAUTH_URL}/upgrade?canceled=true`,
      })

      return session
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  async createPortalSession(userId: string) {
    if (!stripe) {
      throw new Error('Stripe not configured')
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      })

      if (!user?.stripeCustomerId) {
        throw new Error('No Stripe customer found')
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      })

      return session
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  }

  async updateSubscription(userId: string, subscriptionData: {
    subscriptionId: string
    customerId: string
    priceId: string
    currentPeriodEnd: Date
    status: string
  }) {
    try {
      // Determine tier based on price ID
      let tier = 'FREE'
      if (subscriptionData.priceId === PRICING_PLANS.PREMIUM.stripePriceId) {
        tier = 'PREMIUM'
      } else if (subscriptionData.priceId === PRICING_PLANS.PRO.stripePriceId) {
        tier = 'PRO'
      }

      // Only update if subscription is active
      if (subscriptionData.status === 'active') {
        await prisma.user.update({
          where: { id: userId },
          data: {
            tier,
            stripeCustomerId: subscriptionData.customerId,
            stripeSubscriptionId: subscriptionData.subscriptionId,
            stripePriceId: subscriptionData.priceId,
            stripeCurrentPeriodEnd: subscriptionData.currentPeriodEnd,
          },
        })
      } else {
        // Downgrade to free if subscription is not active
        await prisma.user.update({
          where: { id: userId },
          data: {
            tier: 'FREE',
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        })
      }

      return true
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  async cancelSubscription(userId: string) {
    if (!stripe) {
      throw new Error('Stripe not configured')
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeSubscriptionId: true },
      })

      if (!user?.stripeSubscriptionId) {
        throw new Error('No active subscription found')
      }

      // Cancel subscription at period end
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })

      return true
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  async resumeSubscription(userId: string) {
    if (!stripe) {
      throw new Error('Stripe not configured')
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeSubscriptionId: true },
      })

      if (!user?.stripeSubscriptionId) {
        throw new Error('No subscription found')
      }

      // Resume subscription
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: false,
      })

      return true
    } catch (error) {
      console.error('Error resuming subscription:', error)
      throw error
    }
  }

  async getSubscriptionStatus(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          tier: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
        },
      })

      if (!user) {
        return null
      }

      let subscriptionStatus = null
      if (user.stripeSubscriptionId && stripe) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
          subscriptionStatus = {
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            priceId: subscription.items.data[0]?.price.id,
          }
        } catch (error) {
          console.error('Error fetching subscription from Stripe:', error)
        }
      }

      return {
        tier: user.tier,
        currentPeriodEnd: user.stripeCurrentPeriodEnd,
        subscription: subscriptionStatus,
      }
    } catch (error) {
      console.error('Error getting subscription status:', error)
      return null
    }
  }
}

export const subscriptionManager = new SubscriptionManager()