import React from "react";

export default function CurrencyDropdown({
  label,
  value,
  onChange,
  options = [],
  name,
  disabled,
  favorites,
  onToggleFavorite,
}) {
  const favSet = favorites instanceof Set ? favorites : new Set(favorites ?? []);
  const favList = options.filter((o) => favSet.has(o.code));
  const restList = options.filter((o) => !favSet.has(o.code));
  const isFav = favSet.has(value);

  return (
    <label className="block text-sm font-medium text-foreground/80">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span>{label}</span>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(value)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-all border ${
              isFav
                ? "text-yellow-700 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20"
                : "text-muted-foreground border-transparent hover:text-foreground/80"
            }`}
            aria-pressed={isFav}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className={`h-3.5 w-3.5 ${isFav ? "fill-current" : "fill-transparent"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {isFav ? "Favorited" : "Favorite"}
          </button>
        )}
      </div>

      <div className="relative">
        <select
          name={name}
          disabled={disabled}
          className="w-full appearance-none rounded-lg border bg-white/60 dark:bg-slate-900/70 px-3 py-2 pr-8 shadow-sm outline-none ring-2 ring-transparent focus:ring-cyan-400 transition-all hover:bg-white/80 disabled:opacity-60"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-label={label}
        >
          {favList.length > 0 && (
            <optgroup label="Favorites">
              {favList.map((opt) => (
                <option key={`fav-${opt.code}`} value={opt.code}>
                  {opt.code} — {opt.description}
                </option>
              ))}
            </optgroup>
          )}

          {favList.length > 0 && <option disabled>──────────</option>}

          <optgroup label="All Currencies">
            {restList.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.code} — {opt.description}
              </option>
            ))}
          </optgroup>
        </select>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </div>
    </label>
  );
}
