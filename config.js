// One place to edit your academy's details. Nothing else in the app hard-codes these.
export const ACADEMY = {
  name: 'RIWAQUL ILM',
  arabic: 'رواق العلم',
  tagline: 'Arabic for working adults',
  email: 'hello@riwaqulilm.com', // TODO: replace
  // WhatsApp number in international format, digits only (no +, spaces or dashes).
  whatsapp: '2340000000000', // TODO: replace with your number
  whatsappGroup: '', // optional: paste a WhatsApp group invite link for students
  classLink: 'https://meet.google.com/', // TODO: your Zoom / Google Meet room
  timezone: 'Africa/Lagos',
  timezoneLabel: 'WAT',
  currency: '₦',
};

export const INSTRUCTOR = {
  name: 'Ustadh [Your Name]', // TODO: replace
  title: 'Founder and lead instructor',
  bio: [
    'Replace this paragraph with your story: where you studied Arabic, who your teachers were, and how long you have been teaching.',
    'Say plainly who the academy is for. Adults who work full days, who want a steady weekly rhythm rather than a crash course, and who want to understand what they recite.',
  ],
  credentials: [
    'Add your ijazah, degree or years of teaching experience',
    'Add a second credential',
    'Add a third credential',
  ],
};

// Flip to true once Paystack is connected (see BACKEND_GUIDE.md). Until then, enrolment is free in demo mode.
export const PAYMENTS_ENABLED = false;
export const PASS_MARK = 0.7;
