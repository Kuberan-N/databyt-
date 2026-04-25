"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  isLoaded: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  isLoaded: false,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          if (data.country_code === "IN") {
            setCurrency("INR");
          }
        }
      } catch (error) {
        console.error("Failed to fetch IP data, defaulting to USD", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, isLoaded }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
