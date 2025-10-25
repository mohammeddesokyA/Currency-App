
import { HiOutlineStar, HiStar } from "react-icons/hi2";
import { useState, useEffect, useMemo } from "react";  

const CurrencyDropdown = ({
  currencies,
  currency,
  setCurrency,
  favorites,
  handleFavorite,
  title = "",
}) => {
  const isFavorite = (curr) => favorites.includes(curr);
  const [currencyNames, setCurrencyNames] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCurrencyNames = async () => {
      try {
        const res = await fetch("https://api.frankfurter.app/currencies");
        const data = await res.json();
        setCurrencyNames(data);
      } catch (error) {
        console.error("Error fetching currency names:", error);
      }
    };
    fetchCurrencyNames();
  }, []);

  const favoriteCurrencies = useMemo(
    () => currencies.filter((curr) => favorites.includes(curr)),
    [currencies, favorites]
  );

  const otherCurrencies = useMemo(
    () =>
      currencies
        .filter((curr) => !favorites.includes(curr))
        .filter((curr) => {
          const term = searchTerm.toLowerCase();
          const code = curr.toLowerCase();
          const name = (currencyNames[curr] || "").toLowerCase();
          return code.includes(term) || name.includes(term);
        }),
    [currencies, favorites, searchTerm, currencyNames]
  );

  return (
    <div>
      <label htmlFor={title} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {title}
      </label>
      <div className="relative">
        
        <details className="relative">
          
          <summary 
            className="w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-10 cursor-pointer"
          >
            {currency} - {currencyNames[currency] || currency}
          </summary>

          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border dark:border-gray-700 max-h-60 overflow-y-auto">
            
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search currency..."
              className="w-full p-2 sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 focus:outline-none"
              onClick={(e) => e.stopPropagation()}     
            />

            {favoriteCurrencies.length > 0 && (
              <div>
                <span className="block px-3 py-1 text-xs font-semibold text-gray-500">Favorites</span>
                {favoriteCurrencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      document.activeElement.blur();     
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-800"
                  >
                    {curr} - {currencyNames[curr] || curr}
                  </button>
                ))}
              </div>
            )}
            
            <div>
              <span className="block px-3 py-1 text-xs font-semibold text-gray-500">All Currencies</span>
              {otherCurrencies.length > 0 ? (
                otherCurrencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      document.activeElement.blur();   
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-800"
                  >
                    {curr} - {currencyNames[curr] || curr}
                  </button>
                ))
              ) : (
                <span className="block px-3 py-2 text-sm text-gray-500">No results found.</span>
              )}
            </div>

          </div>
        </details>


        <button
          onClick={() => handleFavorite(currency)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 z-10" // (ضفنا z-10)
        >
          {isFavorite(currency) ? (
            <HiStar className="h-5 w-5 text-yellow-500" />
          ) : (
            <HiOutlineStar className="h-5 w-5 transition-colors duration-300" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CurrencyDropdown;