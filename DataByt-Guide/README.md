# DataByt Guide

Three documents. Everything you need to **run** DataByt, **master** the discipline behind it, and **grow** it on LinkedIn.

Each folder has a styled `.html` source, a `generate-pdf.js` script, and the ready-to-read **PDF**.

---

## 📘 01 · User Manual
**[DataByt-User-Manual.pdf](01-user-manual/DataByt-User-Manual.pdf)**

How to operate every part of DataByt — login, loading data, the dashboard's 8 metrics, AR Aging actions (Email / Pay link / Mark Paid), the Collections pipeline, disputes, analytics, reports, integrations, settings, the AI Assistant, and your 5-minute daily workflow. **Start here.**

## 📗 02 · AR Mastery Guide
**[DataByt-AR-Mastery-Guide.pdf](02-ar-mastery/DataByt-AR-Mastery-Guide.pdf)**

The discipline behind the software. Read this once and you'll understand AR better than most CFOs: the 7 metrics (DSO, CEI, BPDSO, ADD, Overdue %, AR Turnover, Bad Debt) with formulas and benchmarks, how to read AR aging, the dunning escalation strategy, customer segmentation, dispute management, the cost of late payments, industry benchmarks, the 10-step DSO reduction playbook, and the 7 deadly AR mistakes.

## 📙 03 · LinkedIn Founder Playbook
**[DataByt-LinkedIn-Playbook.pdf](03-linkedin-playbook/DataByt-LinkedIn-Playbook.pdf)**

A 30-day done-for-you content engine for the founder. 20 copy-paste posts (US/EU CFO audience), each with a teaching breakdown — the hook technique, the psychology, the structure, and the one move to steal. Plus the daily routine, who to follow, and how to engineer your feed to hit 50 CFO followers.

---

### Regenerating a PDF
After editing any `.html`, rebuild its PDF:
```bash
cd <folder>
node generate-pdf.js
```
(Uses local Chrome/Edge via `puppeteer-core`.)
