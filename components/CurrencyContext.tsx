"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "USD" | "INR";

const USD_RATE = 83;

interface CurrencyContextType {
  currency: Currency;
  isLoaded: boolean;
  setCurrency: (c: Currency) => void;
  /** Format a base INR amount in the active currency. */
  fmt: (amountInINR: number) => string;
  /** Convert a base INR amount to the active currency as a raw number. */
  toLocal: (amountInINR: number) => number;
  /** The currency symbol */
  symbol: string;
}

function formatINR(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
  }
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${Math.round(amount)}`;
}

function formatUSD(amount: number): string {
  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (amount >= 1000) {
    const k = amount / 1000;
    return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `$${Math.round(amount)}`;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  isLoaded: false,
  setCurrency: () => {},
  fmt: (n) => formatUSD(n / USD_RATE),
  toLocal: (n) => n / USD_RATE,
  symbol: "$",
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);
  const [userOverride, setUserOverride] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          if (!userOverride) {
            setCurrencyState(data.country_code === "IN" ? "INR" : "USD");
          }
        }
      } catch (error) {
        console.error("Failed to fetch IP data, defaulting to USD", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCurrency = (c: Currency) => {
    setUserOverride(true);
    setCurrencyState(c);
  };

  const fmt = (amountInINR: number): string =>
    currency === "INR" ? formatINR(amountInINR) : formatUSD(amountInINR / USD_RATE);

  const toLocal = (amountInINR: number): number =>
    currency === "INR" ? amountInINR : amountInINR / USD_RATE;

  const symbol = currency === "INR" ? "₹" : "$";

  return (
    <CurrencyContext.Provider value={{ currency, isLoaded, setCurrency, fmt, toLocal, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
