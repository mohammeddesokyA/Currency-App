import { useEffect, useMemo, useRef, useState } from "react";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import ResultDisplay from "@/components/ResultDisplay";
import { convertCurrency, fetchSymbols, type CurrencySymbol } from "@/lib/exchange";
import { usePersistFavorites } from "@/components/hooks/usePersistFavorites";

export default function ConverterForm() {
  const [symbols, setSymbols] = useState<CurrencySymbol[]>([]);
  const [amount, setAmount] = useState<string>("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const [loadingSymbols, setLoadingSymbols] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const abortRef = useRef<AbortController | null>(null);

  // persist favorites
  usePersistFavorites(favorites);

  useEffect(() => {
    let ignore = false;
    const cached = localStorage.getItem("fx_symbols_v1");
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as CurrencySymbol[];
        if (Array.isArray(parsed) && parsed.length > 0) setSymbols(parsed);
      } catch {}
    }
    const fav = localStorage.getItem("fx_favorites_v1");
    if (fav) {
      try {
        const arr = JSON.parse(fav) as string[];
        if (Array.isArray(arr)) setFavorites(new Set(arr));
      } catch {}
    }
    const load = async () => {
      setLoadingSymbols(true);
      try {
        const data = await fetchSymbols();
        if (!ignore) {
          setSymbols(data);
          localStorage.setItem("fx_symbols_v1", JSON.stringify(data));
        }
      } catch (e) {
        console.error(e);
        if (!ignore) {
          // Fallback to a minimal set so the app remains usable
          const { FALLBACK_SYMBOLS } = await import("@/lib/exchange");
          setSymbols(FALLBACK_SYMBOLS);
          setError((e?.message ?? "Failed to load currencies") + ". Using limited fallback list.");
        }
      } finally {
        if (!ignore) setLoadingSymbols(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const canConvert = useMemo(() => symbols.length > 0 && amount.trim() !== "", [symbols.length, amount]);

  const onSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setRate(null);
  };

  const toggleFavorite = (code) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const onConvert = async () => {
    setError(null);
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) {
      setError("Enter a valid, non-negative amount.");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await convertCurrency(amt, from, to, controller.signal);
      if (res.success) {
        setResult(res.result);
        setRate(res.info?.rate ?? null);
      } else {
        setError("Conversion failed. Try again.");
      }
    } catch (e) {
      console.error(e);
      if (e?.name === "AbortError") return;
      setError(e?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="group rounded-2xl border bg-white/70 dark-slate-900/60 p-6 shadow-lg ring-1 ring-black/5 backdrop-blur transition-all hover-xl hover-cyan-200/70 dark-cyan-900/40 focus-within-cyan-500/20">
        <div className="grid grid-cols-1 md-cols-2 gap-4 md-6">
          <label className="block text-sm font-medium text-foreground/80">
            <span className="mb-1 inline-block">Amount</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border bg-white/60 dark-slate-900/70 px-3 py-2 shadow-sm outline-none ring-2 ring-transparent focus-cyan-500/40 focus-cyan-500 transition-all hover-white/80 focus-md"
              placeholder="0.00"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <CurrencyDropdown
              label="From"
              value={from}
              onChange={setFrom}
              options={symbols}
              disabled={loadingSymbols}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
            <CurrencyDropdown
              label="To"
              value={to}
              onChange={setTo}
              options={symbols}
              disabled={loadingSymbols}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSwap}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-foreground hover-muted transition-all hover-sm active-[.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 7h10M7 7l3-3m-3 3l3 3" />
              <path d="M17 17H7m10 0l-3-3m3 3l-3 3" />
            </svg>
            Swap
          </button>

          <button
            type="button"
            onClick={onConvert}
            disabled={!canConvert || loading}
            className="ml-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover-cyan-600 hover-blue-700 active-cyan-700 active-blue-800 disabled-50 disabled-not-allowed transition-all hover-md active-[.98] focus-visible-none focus-visible-2 focus-visible-cyan-500/50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-30" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                </svg>
                Converting...
              </span>
            ) : (
              "Convert"
            )}
          </button>
        </div>

        <ResultDisplay
          amount={Number(amount)}
          from={from}
          to={to}
          result={result}
          rate={rate}
          loading={loading}
          error={error}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground text-center">
        Exchange rates by frankfurter.app. Results are for informational purposes only.
      </p>
    </div>
  );
}
