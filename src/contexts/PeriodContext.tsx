import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PeriodContextType {
  currentPeriod: string;
  setCurrentPeriod: (period: string) => void;
  availablePeriods: string[];
  isLoadingPeriods: boolean;
  fitrahRateUang: number;
  setFitrahRateUang: (rate: number) => void;
}

// Default period based on current Hijri year approximation
// Ramadan 2026 ≈ 1448H
const DEFAULT_PERIOD = "1448";
const DEFAULT_FITRAH_RATE_UANG = 37500;

const getRateKey = (period: string) => `zakat_fitrah_rate_${period}`;

const loadRate = (period: string): number => {
  const stored = localStorage.getItem(getRateKey(period));
  return stored ? Number(stored) : DEFAULT_FITRAH_RATE_UANG;
};

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPeriod, setCurrentPeriod] = useState<string>(() => {
    return localStorage.getItem("zakat_period") || DEFAULT_PERIOD;
  });

  const [fitrahRateUang, setFitrahRateUangState] = useState<number>(() => {
    const period = localStorage.getItem("zakat_period") || DEFAULT_PERIOD;
    return loadRate(period);
  });

  const handleSetPeriod = (period: string) => {
    setCurrentPeriod(period);
    localStorage.setItem("zakat_period", period);
    setFitrahRateUangState(loadRate(period));
  };

  const handleSetFitrahRateUang = (rate: number) => {
    setFitrahRateUangState(rate);
    localStorage.setItem(getRateKey(currentPeriod), String(rate));
  };

  // Fetch distinct periods from the database
  const { data: availablePeriods = [], isLoading: isLoadingPeriods } = useQuery({
    queryKey: ["zakatPeriods"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zakat_records")
        .select("period")
        .order("period", { ascending: false });

      if (error) throw error;

      // Extract unique periods
      const periods = [...new Set(data.map((r) => r.period))];

      // Ensure the current/default period is always in the list
      if (!periods.includes(DEFAULT_PERIOD)) {
        periods.unshift(DEFAULT_PERIOD);
      }

      return periods;
    },
  });

  return (
    <PeriodContext.Provider
      value={{
        currentPeriod,
        setCurrentPeriod: handleSetPeriod,
        availablePeriods,
        isLoadingPeriods,
        fitrahRateUang,
        setFitrahRateUang: handleSetFitrahRateUang,
      }}
    >
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = (): PeriodContextType => {
  const context = useContext(PeriodContext);
  if (context === undefined) {
    throw new Error("usePeriod must be used within a PeriodProvider");
  }
  return context;
};

export { DEFAULT_PERIOD };
