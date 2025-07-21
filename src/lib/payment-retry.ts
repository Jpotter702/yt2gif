import { stripe } from './stripe'
import { prisma } from './prisma'

export class PaymentRetryHandler {
  async handleFailedPayment(customerId: string, invoiceId: string, attemptCount: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      })

      if (!user) {
        console.error('User not found for customer:', customerId)
        return
      }

      // Get invoice details
      const invoice = await stripe.invoices.retrieve(invoiceId)
      
      if (attemptCount === 1) {
        // First failure - send gentle reminder
        await this.sendPaymentFailureEmail(user.email!, {
          type: 'first_failure',
          amount: invoice.amount_due,
          nextRetry: this.getNextRetryDate(attemptCount),
        })
      } else if (attemptCount === 2) {
        // Second failure - more urgent
        await this.sendPaymentFailureEmail(user.email!, {
          type: 'second_failure',
          amount: invoice.amount_due,
          nextRetry: this.getNextRetryDate(attemptCount),
        })
      } else if (attemptCount >= 3) {
        // Final failure - downgrade account
        await this.downgradeAccount(user.id)
        await this.sendPaymentFailureEmail(user.email!, {
          type: 'final_failure',
          amount: invoice.amount_due,
        })
      }
    } catch (error) {
      console.error('Error handling failed payment:', error)
    }
  }

  private async downgradeAccount(userId: string) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: 'FREE',
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      })

      console.log(`Account downgraded to FREE for user: ${userId}`)
    } catch (error) {
      console.error('Error downgrading account:', error)
      throw error
    }
  }

  private async sendPaymentFailureEmail(email: string, details: {
    type: 'first_failure' | 'second_failure' | 'final_failure'
    amount: number
    nextRetry?: Date
  }) {
    // TODO: Implement email sending (could use SendGrid, SES, etc.)
    const amount = (details.amount / 100).toFixed(2)
    
    switch (details.type) {
      case 'first_failure':
        console.log(`Sending first failure email to ${email} for $${amount}`)
        // Email: "Payment Failed - We'll retry in 3 days"
        break
      case 'second_failure':
        console.log(`Sending second failure email to ${email} for $${amount}`)
        // Email: "Payment Failed Again - Please update your payment method"
        break
      case 'final_failure':
        console.log(`Sending final failure email to ${email} for $${amount}`)
        // Email: "Account downgraded due to payment failure - Reactivate anytime"
        break
    }
  }

  private getNextRetryDate(attemptCount: number): Date {
    const now = new Date()
    
    // Stripe's default retry schedule
    switch (attemptCount) {
      case 1:
        // Retry in 3 days
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      case 2:
        // Retry in 5 days
        return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)
      default:
        // Final attempt in 7 days
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    }
  }

  async retryFailedInvoice(invoiceId: string) {
    try {
      const invoice = await stripe.invoices.pay(invoiceId, {
        payment_method: undefined, // Use default payment method
      })

      if (invoice.status === 'paid') {
        console.log(`Successfully retried payment for invoice: ${invoiceId}`)
        return { success: true }
      } else {
        console.log(`Payment retry failed for invoice: ${invoiceId}`)
        return { success: false, status: invoice.status }
      }
    } catch (error) {
      console.error('Error retrying failed invoice:', error)
      return { success: false, error }
    }
  }

  async updatePaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })

      console.log(`Updated payment method for customer: ${customerId}`)
      return { success: true }
    } catch (error) {
      console.error('Error updating payment method:', error)
      return { success: false, error }
    }
  }
}

export const paymentRetryHandler = new PaymentRetryHandler()