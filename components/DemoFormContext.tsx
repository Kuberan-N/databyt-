"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const DemoFormContext = createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
}>({ isOpen: false, open: () => {}, close: () => {} });

export function DemoFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DemoFormContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </DemoFormContext.Provider>
  );
}

export function useDemoForm() {
  return useContext(DemoFormContext);
}
