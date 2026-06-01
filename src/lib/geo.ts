export type Locale = "IN" | "INTL";

export interface LocaleConfig {
  locale: Locale;
  symbol: string;
  currency: string;
  // Pricing
  foundingMonthly: number;
  standardMonthly: number;
  foundingAnnual: number;
  annualMonthlyEffective: number;
  annualSaving: number;
  // ROI Calculator
  roiRevenueMin: number;
  roiRevenueMax: number;
  roiRevenueStep: number;
  roiRevenueDefault: number;
  roiDsoDefault: number;
  roiDataBytCostYear: number;
  roiDataBytMonthly: number;
  roiRevenueToBaseUnit: number; // multiply slider value to get base currency unit
  roiRevenueLabel: string; // e.g. "$M" or "₹Cr"
  // Stats
  arRecoveredStat: string;
  arOverheadStat: string;
  arOverheadUnit: string;
  laborCostStat: string;
  opportunityCostPerDay: string;
  opportunityCostAt: string;
  // FinalCTA urgency
  urgencyOppCost: string;
}

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  INTL: {
    locale:                 "INTL",
    symbol:                 "$",
    currency:               "USD",
    foundingMonthly:        2000,
    standardMonthly:        4000,
    foundingAnnual:         20000,
    annualMonthlyEffective: 1667,
    annualSaving:           4000,
    roiRevenueMin:          1,
    roiRevenueMax:          100,
    roiRevenueStep:         1,
    roiRevenueDefault:      10,
    roiDsoDefault:          55,
    roiDataBytCostYear:     24000,
    roiDataBytMonthly:      2000,
    roiRevenueToBaseUnit:   1_000_000,   // $1M
    roiRevenueLabel:        "$M",
    arRecoveredStat:        "$847K",
    arOverheadStat:         "$39K",
    arOverheadUnit:         "/year",
    laborCostStat:          "$88K",
    opportunityCostPerDay:  "$2,700",
    opportunityCostAt:      "$10M revenue",
    urgencyOppCost:         "$2,700",
  },
  IN: {
    locale:                 "IN",
    symbol:                 "₹",
    currency:               "INR",
    foundingMonthly:        39000,
    standardMonthly:        79000,
    foundingAnnual:         390000,
    annualMonthlyEffective: 32500,
    annualSaving:           78000,
    roiRevenueMin:          10,
    roiRevenueMax:          500,
    roiRevenueStep:         10,
    roiRevenueDefault:      50,          // ₹50 Cr default
    roiDsoDefault:          60,
    roiDataBytCostYear:     390000,      // ₹3,90,000/year
    roiDataBytMonthly:      32500,       // ₹32,500/month effective
    roiRevenueToBaseUnit:   10_000_000,  // 1 Cr = 1,00,00,000
    roiRevenueLabel:        "₹Cr",
    arRecoveredStat:        "₹7Cr",
    arOverheadStat:         "₹32L",
    arOverheadUnit:         "/year",
    laborCostStat:          "₹72L",
    opportunityCostPerDay:  "₹2.2L",
    opportunityCostAt:      "₹83Cr revenue",
    urgencyOppCost:         "₹2.2L",
  },
};

export function getLocaleConfig(country: string | null): LocaleConfig {
  return country === "IN" ? LOCALE_CONFIG.IN : LOCALE_CONFIG.INTL;
}

// Formatting helpers (client-safe — no server APIs)
export function fmtCurrency(n: number, locale: Locale): string {
  if (locale === "IN") {
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
    if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
    if (n >= 1_000)      return `₹${Math.round(n / 1000)}K`;
    return `₹${Math.round(n)}`;
  }
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

export function fmtRevenueLabel(n: number, locale: Locale): string {
  return locale === "IN" ? `₹${n}Cr` : `$${n}M`;
}
