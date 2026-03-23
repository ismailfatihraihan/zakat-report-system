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

const DEFAULT_PERIOD_FALLBACK = "1448";
const DEFAULT_FITRAH_RATE_UANG = 37500;
const PERIOD_STORAGE_KEY = "zakat_period";
const PERIOD_MIGRATION_KEY = "zakat_period_auto_migrated_v1";
const HIJRI_LOCALES = ["en-u-ca-islamic-umalqura", "en-u-ca-islamic"];

const isValidPeriod = (value: string | null): value is string => {
  return !!value && /^\d{3,5}$/.test(value);
};

const toPeriodNumber = (value: string): number => {
  return Number.parseInt(value, 10);
};

const getStoredPeriod = (): string | null => {
  const stored = localStorage.getItem(PERIOD_STORAGE_KEY);
  return isValidPeriod(stored) ? stored : null;
};

const resolveInitialPeriod = (defaultPeriod: string): string => {
  const storedPeriod = getStoredPeriod();

  if (!storedPeriod) {
    localStorage.setItem(PERIOD_STORAGE_KEY, defaultPeriod);
    return defaultPeriod;
  }

  const hasMigrated = localStorage.getItem(PERIOD_MIGRATION_KEY) === "1";

  if (!hasMigrated && toPeriodNumber(storedPeriod) < toPeriodNumber(defaultPeriod)) {
    localStorage.setItem(PERIOD_STORAGE_KEY, defaultPeriod);
    localStorage.setItem(PERIOD_MIGRATION_KEY, "1");
    return defaultPeriod;
  }

  return storedPeriod;
};

const getUpcomingRamadanPeriod = (): string => {
  try {
    let parts: Intl.DateTimeFormatPart[] | null = null;

    for (const locale of HIJRI_LOCALES) {
      try {
        parts = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "numeric",
          timeZone: "UTC",
        }).formatToParts(new Date());
        break;
      } catch {
        // Try next locale.
      }
    }

    if (!parts) {
      return DEFAULT_PERIOD_FALLBACK;
    }

    const yearValue = parts.find((part) => part.type === "year")?.value;
    const monthValue = parts.find((part) => part.type === "month")?.value;

    const hijriYear = Number(yearValue);
    const hijriMonth = Number(monthValue);

    if (!Number.isFinite(hijriYear) || !Number.isFinite(hijriMonth)) {
      return DEFAULT_PERIOD_FALLBACK;
    }

    // If Ramadan (month 9) has passed, prepare next Hijri year.
    return hijriMonth > 9 ? String(hijriYear + 1) : String(hijriYear);
  } catch {
    return DEFAULT_PERIOD_FALLBACK;
  }
};

const DEFAULT_PERIOD = getUpcomingRamadanPeriod();

const getRateKey = (period: string) => `zakat_fitrah_rate_${period}`;

const loadRate = (period: string): number => {
  const stored = localStorage.getItem(getRateKey(period));
  const parsed = stored ? Number(stored) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_FITRAH_RATE_UANG;
};

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPeriod, setCurrentPeriod] = useState<string>(() => {
    return resolveInitialPeriod(DEFAULT_PERIOD);
  });

  const [fitrahRateUang, setFitrahRateUangState] = useState<number>(() => {
    const period = getStoredPeriod() || DEFAULT_PERIOD;
    return loadRate(period);
  });

  const handleSetPeriod = (period: string) => {
    setCurrentPeriod(period);
    localStorage.setItem(PERIOD_STORAGE_KEY, period);
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
      const periods = [...new Set(data.map((r) => r.period).filter(isValidPeriod))];

      // Ensure active and default periods are always selectable.
      if (!periods.includes(currentPeriod)) {
        periods.unshift(currentPeriod);
      }

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
