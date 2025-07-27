import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { subscriptionManager } from '@/lib/subscription-manager'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer as string
        
        // Find user by customer ID
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await subscriptionManager.updateSubscription(user.id, {
            subscriptionId: subscription.id,
            customerId: customerId,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer as string
        
        // Find user by customer ID and downgrade to free
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              tier: 'FREE',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const customerId = invoice.customer as string
        
        // Find user and ensure subscription is active
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user && invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          
          await subscriptionManager.updateSubscription(user.id, {
            subscriptionId: subscription.id,
            customerId: customerId,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: subscription.status,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customerId = invoice.customer as string
        
        // Find user and handle payment failure
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          // Log payment failure
          console.log(`Payment failed for user ${user.id}`, {
            invoiceId: invoice.id,
            attemptCount: invoice.attempt_count,
            amount: invoice.amount_due,
          })

          // If this is the final attempt, downgrade user
          if (invoice.attempt_count >= 3) {
            console.log(`Final payment attempt failed for user ${user.id}, downgrading to FREE`)
            
            await prisma.user.update({
              where: { id: user.id },
              data: {
                tier: 'FREE',
                stripeSubscriptionId: null,
                stripePriceId: null,
                stripeCurrentPeriodEnd: null,
              },
            })

            // TODO: Send email notification about downgrade
          } else {
            // TODO: Send email about failed payment with retry info
            console.log(`Payment retry ${invoice.attempt_count}/3 for user ${user.id}`)
          }
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}