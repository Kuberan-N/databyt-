"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "USD" | "INR";

interface CurrencyContextType {
  currency: Currency;
  isLoaded: boolean;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  isLoaded: false,
  setCurrency: () => {},
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
          if (data.country_code === "IN") {
            if (!userOverride) setCurrencyState("INR");
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

  return (
    <CurrencyContext.Provider value={{ currency, isLoaded, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
