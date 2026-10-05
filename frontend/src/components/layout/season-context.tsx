"use client";

import { createContext, useCallback, useContext, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Season } from "@/types/season";

const SEASON_COOKIE = "euroscout_season";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

type SeasonContextValue = {
  isPending: boolean;
  seasons: Season[];
  selectedSeasonCode: string | null;
  selectSeason: (seasonCode: string) => void;
  withSeason: (href: string) => string;
};

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({
  children,
  initialSeasonCode,
  seasons,
}: Readonly<{ children: React.ReactNode; initialSeasonCode: string | null; seasons: Season[] }>) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSeason = searchParams.get("season_code");
  const validUrlSeason = seasons.some((season) => season.code === urlSeason) ? urlSeason : null;
  const [storedSeasonCode, setStoredSeasonCode] = useState(initialSeasonCode);
  const selectedSeasonCode = validUrlSeason ?? storedSeasonCode;
  const [isPending, startTransition] = useTransition();

  const selectSeason = useCallback((seasonCode: string) => {
    if (!seasons.some((season) => season.code === seasonCode)) return;
    setStoredSeasonCode(seasonCode);
    document.cookie = `${SEASON_COOKIE}=${encodeURIComponent(seasonCode)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    const params = new URLSearchParams(searchParams.toString());
    params.set("season_code", seasonCode);
    params.delete("page");
    if (pathname === "/scout") {
      params.delete("playerA");
      params.delete("playerB");
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }, [pathname, router, searchParams, seasons]);

  const withSeason = useCallback((href: string): string => {
    if (!selectedSeasonCode) return href;
    const [path, query = ""] = href.split("?");
    const params = new URLSearchParams(query);
    params.set("season_code", selectedSeasonCode);
    return `${path}?${params.toString()}`;
  }, [selectedSeasonCode]);

  const value = useMemo(
    () => ({ isPending, seasons, selectedSeasonCode, selectSeason, withSeason }),
    [isPending, seasons, selectedSeasonCode, selectSeason, withSeason],
  );

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export function useSeason(): SeasonContextValue {
  const context = useContext(SeasonContext);
  if (!context) throw new Error("useSeason must be used inside SeasonProvider.");
  return context;
}
