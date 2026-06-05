# DataByt Guide

Six documents — everything to **run** DataByt, **master** the discipline, **grow** an audience, and **convert** it into paying customers.

Each folder has a styled `.html` source, a `generate-pdf.js` script, and the ready-to-read **PDF**.

---

## 🟪 Operate & Master

### 📘 01 · User Manual
**[DataByt-User-Manual.pdf](01-user-manual/DataByt-User-Manual.pdf)**

How to operate every part of DataByt — login, loading data, the dashboard's 8 metrics, AR Aging actions (Email / Pay link / Mark Paid), the Collections pipeline, disputes, analytics, reports, integrations, settings, the AI Assistant, and your 5-minute daily workflow. **Start here.**

### 📗 02 · AR Mastery Guide
**[DataByt-AR-Mastery-Guide.pdf](02-ar-mastery/DataByt-AR-Mastery-Guide.pdf)**

The discipline behind the software. Read once and you'll understand AR better than most CFOs: the 7 metrics with formulas + benchmarks, reading AR aging, the dunning escalation strategy, segmentation, disputes, the cost of late payments, industry benchmarks, the 10-step DSO reduction playbook, and the 7 deadly AR mistakes.

---

## 🟦 Grow & Convert

### 📙 03 · LinkedIn Founder Playbook — Month 1 (Days 1–20)
**[DataByt-LinkedIn-Playbook.pdf](03-linkedin-playbook/DataByt-LinkedIn-Playbook.pdf)**

The Authority phase. 20 copy-paste posts (US/EU CFO audience), each with a teaching breakdown — hook technique, psychology, structure, the move to steal. Plus the daily routine, who to follow, and how to engineer your feed to hit 50 CFO followers.

### 📙 03 · LinkedIn Founder Playbook — Month 2 (Days 21–40)
**[DataByt-LinkedIn-Playbook-Month2.pdf](03-linkedin-playbook/DataByt-LinkedIn-Playbook-Month2.pdf)**

The Trust phase. 20 more posts (Days 21–40) that deepen authority, bring real CFO conversations into the feed, and warm the audience toward the free pilot — same teaching breakdown on every post, plus the Month-2 pillar mix and what to do after Day 40.

### 📕 04 · Sales & Conversion Playbook
**[DataByt-Sales-Playbook.pdf](04-sales-playbook/DataByt-Sales-Playbook.pdf)**

The bridge from CFO contact → paying customer. DM/email scripts, the discovery call script, word-for-word objection handling, the competitor battle card, the free-pilot sequence, how to ask for the testimonial, and the convert-free-to-paid conversation.

### 📄 05 · Sales Sheet (one-pager)
**[DataByt-Sales-Sheet.pdf](05-sales-sheet/DataByt-Sales-Sheet.pdf)**

A single-page leave-behind to send a CFO after a call. The problem, the stats, how it works, what's included, why DataByt vs the alternatives, and the CTA. Print it or attach it.

### 📑 06 · Demo & Onboarding Script
**[DataByt-Demo-Onboarding-Script.pdf](06-demo-script/DataByt-Demo-Onboarding-Script.pdf)**

The 15-minute demo flow (beat by beat, what to say), the three "wow" moments, demo do's & don'ts, and the 48-hour onboarding + first-week checklist that drives a pilot to a visible win.

---

### The flow these documents follow
```
02 Master AR  →  01 Run the product  →  03 Build audience (LinkedIn)
              →  04 Convert  +  05 Leave-behind  +  06 Demo & onboard
```

### Regenerating a PDF
After editing any `.html`, rebuild its PDF:
```bash
cd <folder>
node generate-pdf.js
```
(Uses local Chrome/Edge via `puppeteer-core`.)
