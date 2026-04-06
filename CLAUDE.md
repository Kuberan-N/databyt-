# CLAUDE.md — Databyt Landing Page

## Project Overview
Databyt is an automated investor reporting agency for Indian D2C and SaaS startup founders. This is a single-page dark-themed landing page designed to convert founder visitors into demo requests.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **Backend:** Supabase (for contact form submissions)
- **Deployment:** Vercel
- **Domain:** databyt.in
- **Font:** Inter (headings: 700/800 weight, body: 400/500 weight) — import from Google Fonts
- **Icons:** Lucide React

## Brand Guidelines

### Colors
```
--bg-primary: #0A0A0A        (near-black background)
--bg-secondary: #111111      (card backgrounds)
--bg-tertiary: #1A1A1A       (hover states, borders)
--accent-primary: #8B5CF6    (purple — primary accent)
--accent-secondary: #A78BFA  (lighter purple — hover states)
--accent-gradient: linear-gradient(135deg, #8B5CF6, #C084FC)  (purple gradient)
--text-primary: #FFFFFF       (headings)
--text-secondary: #A1A1AA     (body text, descriptions)
--text-muted: #71717A         (subtle text, labels)
--border: #27272A             (card borders, dividers)
--success: #10B981            (green for positive metrics)
--danger: #EF4444             (red for negative metrics)
```

### Typography Scale
```
Hero heading:     text-5xl md:text-7xl font-extrabold tracking-tight
Section heading:  text-3xl md:text-5xl font-bold
Sub-heading:      text-xl md:text-2xl font-semibold
Body:             text-base md:text-lg font-normal text-zinc-400
Small/Label:      text-sm font-medium text-zinc-500
```

### Design Principles
1. **Dark-first:** Everything is dark background. No white sections.
2. **Purple accents only:** Purple is the ONLY color accent. No blue, teal, or other colors.
3. **Minimal:** Maximum whitespace. No clutter. Every element earns its place.
4. **Data-forward:** Use metric cards, numbers, and dashboard mockups to show credibility.
5. **Founder-centric copy:** Every line speaks to a D2C/SaaS founder in India. Use ₹ not $. Reference Razorpay, not Stripe.
6. **No stock photos. No generic illustrations.** Use abstract gradients, glassmorphism cards, and metric visualizations instead.

### Component Style
- Cards: `bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm`
- Buttons primary: `bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full px-8 py-4 font-semibold`
- Buttons secondary: `border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-white rounded-full px-8 py-4`
- Section padding: `py-24 md:py-32 px-6`
- Max container width: `max-w-6xl mx-auto`
- Card hover: subtle purple glow — `hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]`

### Animations (Framer Motion)
- Sections: fade-in-up on scroll (y: 40 → 0, opacity: 0 → 1, duration: 0.6s)
- Cards: stagger children by 0.1s delay
- Numbers/metrics: count-up animation on scroll into view
- Hero: subtle floating gradient orb in background (CSS animation, not heavy JS)
- CTA buttons: scale(1.02) on hover with transition

## Page Sections (In Order)

### 1. Navigation
- Fixed top, transparent → blur on scroll
- Logo: "Databyt" text in white, bold
- Nav items: How It Works, Pricing, FAQ (smooth scroll anchors)
- CTA button: "Request Demo" (purple, rounded-full)
- Mobile: hamburger menu

### 2. Hero Section
- **Headline:** "Stop Building Your Investor Update Manually."
- **Sub-headline:** "We automate your MRR, churn, CAC, and LTV into a branded report — delivered to your inbox by the 3rd of every month."
- **CTA 1:** "Request a Free Demo" (purple gradient button)
- **CTA 2:** "See How It Works" (ghost/outline button, scrolls to How It Works)
- **Visual:** Abstract purple gradient orb in background (CSS only). Below the CTAs, show a mock dashboard card with sample metrics:
  ```
  MRR: ₹4.2L  (+12% ↑)
  Churn: 3.1%  (-0.8% ↓)
  CAC: ₹1,850  (-₹200 ↓)
  LTV: ₹28,400 (+₹2,100 ↑)
  ```
  Style this as a glassmorphism card with purple border glow.

### 3. Problem Section
- **Headline:** "Sound Familiar?"
- 3 pain point cards in a row:
  - Card 1: "Exporting Razorpay data every month into a spreadsheet"
  - Card 2: "Spending 4+ hours calculating MRR, churn, and CAC manually"
  - Card 3: "Panicking the night before an investor call because numbers don't match"
- Each card: icon (Lucide) + title + 1-line description
- Bottom text: "You didn't start a company to do data entry."

### 4. Solution Section (How It Works)
- **Headline:** "How Databyt Works"
- **Sub-headline:** "From raw data to investor-ready report in 3 steps."
- 3-step horizontal flow with connecting lines/arrows:
  - Step 1: "Connect" — "Link your Razorpay, Google Sheets, and CRM. Takes 30 minutes."
  - Step 2: "Automate" — "We build your metrics pipeline. MRR, churn, CAC, LTV — all calculated automatically."
  - Step 3: "Receive" — "A branded PDF + live dashboard delivered to your inbox by the 3rd of every month."
- Each step: number badge (01, 02, 03) + icon + title + description

### 5. What You Get (Deliverables)
- **Headline:** "What's Inside Your Report"
- Grid of 6 metric cards:
  - MRR & ARR Tracking
  - Churn Rate Analysis
  - Customer Acquisition Cost (CAC)
  - Lifetime Value (LTV)
  - Burn Rate & Runway
  - 3-Line Executive Summary (the human-written narrative)
- Each card: icon + metric name + 1-line description + sample number
- Bottom callout card: "Every report includes a 3-line narrative summary you can copy-paste directly into your investor update."

### 6. Pricing Section
- **Headline:** "Simple Pricing. No Surprises."
- 2 pricing cards side by side:

**Card 1 — Investor Report (B2)** [POPULAR badge]
  - ₹25,000 setup (one-time)
  - ₹5,000/month
  - Features: Automated MRR/churn/CAC/LTV, Branded PDF report, Live dashboard, Monthly narrative summary, Email delivery by the 3rd
  - CTA: "Get Started"

**Card 2 — Full Data Pipeline (B1)**
  - ₹35,000 setup (one-time)
  - ₹5,000/month
  - Features: Everything in Investor Report PLUS: Unified data from Razorpay + Sheets + CRM, Real-time dashboard, Daily data sync, Custom metric definitions
  - CTA: "Request Demo"

- B2 card should have a purple border/glow to indicate it's the recommended option.
- Below pricing: "Setup takes 5 business days. Cancel anytime."

### 7. FAQ Section
- **Headline:** "Questions? We've Got Answers."
- Accordion-style FAQ (click to expand):
  1. "What data sources do you support?" → "Razorpay, Google Sheets, HubSpot, Zoho CRM, and LeadSquared. If you use something else, we'll scope it within 48 hours."
  2. "How long does setup take?" → "5 business days from the day you share access to your data sources."
  3. "Is my data safe?" → "Yes. We use read-only access to your data sources. Your data is processed and stored securely. We never share it with third parties."
  4. "Can I cancel anytime?" → "Yes. No lock-in contracts. Cancel with 30 days notice."
  5. "What if I need custom metrics?" → "The Full Data Pipeline plan includes custom metric definitions. We'll work with you to define exactly what you need."
  6. "Do you work with pre-revenue startups?" → "Our services are designed for startups with at least ₹50K/month in revenue, as you need transaction data for meaningful metrics."

### 8. Final CTA Section
- **Headline:** "Ready to Automate Your Investor Reporting?"
- **Sub-headline:** "Join Indian founders who stopped spending Sundays in Excel."
- **CTA:** "Request a Free Demo" (large purple gradient button)
- Background: subtle purple gradient glow behind the section

### 9. Contact/Demo Form (Modal or Inline Section)
- Opens when any "Request Demo" button is clicked
- Fields:
  - Full Name (required)
  - Email (required)
  - Company Name (required)
  - Monthly Revenue Range (dropdown: "Below ₹50K", "₹50K – ₹2L", "₹2L – ₹5L", "₹5L – ₹10L", "Above ₹10L")
  - Message (optional, textarea)
- Submit button: "Submit Request"
- On submit: save to Supabase table `demo_requests`, show success message: "Thanks! We'll reach out within 24 hours."
- Form validation: client-side with helpful error messages

### 10. Footer
- Left: "© 2026 Databyt. Built for Indian founders."
- Center: Links — Privacy Policy, Terms (can be placeholder pages)
- Right: Email — hello@databyt.in
- Minimal, single row, dark

## Supabase Setup

### Table: `demo_requests`
```sql
CREATE TABLE demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  revenue_range TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new'
);

-- Enable Row Level Security
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anonymous users (public form)
CREATE POLICY "Allow public inserts" ON demo_requests
  FOR INSERT TO anon
  WITH CHECK (true);
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## File Structure
```
databyt/
├── app/
│   ├── layout.tsx          (root layout, fonts, metadata)
│   ├── page.tsx            (main landing page, imports all sections)
│   └── globals.css         (tailwind imports + custom CSS animations)
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── HowItWorks.tsx
│   ├── Deliverables.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── FinalCTA.tsx
│   ├── DemoForm.tsx        (modal form component)
│   ├── Footer.tsx
│   └── ui/
│       ├── MetricCard.tsx   (reusable metric display card)
│       ├── SectionHeading.tsx
│       └── GradientOrb.tsx  (background visual effect)
├── lib/
│   └── supabase.ts         (supabase client init)
├── public/
│   └── og-image.png        (Open Graph image for social sharing)
├── tailwind.config.ts
├── next.config.js
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

## SEO & Meta
```tsx
export const metadata = {
  title: "Databyt — Automated Investor Reporting for Indian Founders",
  description: "Stop building your investor update manually. Databyt automates MRR, churn, CAC, and LTV into a branded report delivered by the 3rd of every month.",
  openGraph: {
    title: "Databyt — Automated Investor Reporting",
    description: "MRR, churn, CAC, LTV — automated and delivered by the 3rd.",
    url: "https://databyt.in",
    siteName: "Databyt",
    type: "website",
  },
}
```

## Performance Requirements
- Lighthouse score: 90+ on all metrics
- No external images (all CSS/SVG)
- Lazy load sections below the fold
- Minimal JS bundle — avoid heavy libraries
- Responsive: mobile-first, works perfectly on 375px to 1440px+

## Important Notes for Claude Code
1. Build component by component. Start with layout.tsx and globals.css, then Hero, then work down.
2. Use `"use client"` directive only on components that need interactivity (Navbar scroll, FAQ accordion, DemoForm, animations).
3. Framer Motion: import `{ motion, useInView }` for scroll animations. Wrap each section in a motion.div with fade-in-up.
4. The mock dashboard in Hero section is STATIC data — not connected to any real API. It's a visual demo only.
5. Purple gradient orb in Hero: use a CSS radial-gradient with blur filter, positioned absolute behind the content. No canvas or heavy animation library.
6. All prices are in Indian Rupees (₹). All examples reference Indian tools (Razorpay, Zoho, etc.).
7. The form must work with Supabase. Use @supabase/supabase-js client library.
8. Ensure the page looks premium and expensive — this is an agency selling to funded founders, not a personal blog.