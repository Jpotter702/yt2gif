import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PRICING_PLANS, PricingPlan } from '@/lib/stripe'
import { subscriptionManager } from '@/lib/subscription-manager'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { newPlan } = await request.json()

    if (!newPlan || (newPlan !== 'PREMIUM' && newPlan !== 'PRO')) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Get user's current subscription
    const subscriptionStatus = await subscriptionManager.getSubscriptionStatus(session.user.id)
    
    if (!subscriptionStatus?.subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Get current subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionStatus.subscription.priceId as string
    )

    const newPriceId = PRICING_PLANS[newPlan as PricingPlan].stripePriceId

    // Update subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: 'always_invoice',
    })

    // Update user's tier in database
    await subscriptionManager.updateSubscription(session.user.id, {
      subscriptionId: updatedSubscription.id,
      customerId: updatedSubscription.customer as string,
      priceId: newPriceId,
      currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
      status: updatedSubscription.status,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully changed to ${newPlan} plan`,
    })
  } catch (error) {
    console.error('Plan change error:', error)
    return NextResponse.json(
      { error: 'Failed to change plan' },
      { status: 500 }
    )
  }
}