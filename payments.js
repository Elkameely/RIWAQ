// PAYMENTS STUB. The UI calls startCheckout() when a student pays for a course.
// Today it simply enrols them (demo). To go live, replace the body with Paystack Inline:
//
//   const handler = PaystackPop.setup({
//     key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
//     email, amount: course.price * 100, currency: 'NGN',
//     ref: crypto.randomUUID(),
//     callback: () => verifyOnServer(ref),   // a Supabase Edge Function checks the payment, then activates the enrolment
//   });
//   handler.openIframe();
//
// Never trust the browser alone: the enrolment must only become 'active' after your server confirms the payment.
import { PAYMENTS_ENABLED } from '../config';

export async function startCheckout({ user, course }) {
  if (!PAYMENTS_ENABLED) return { ok: true, mode: 'demo' };
  throw new Error('Payments are switched on but the checkout is not connected yet.');
}
