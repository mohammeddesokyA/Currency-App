// ملف: hooks/useCurrencyConverterLogic.js

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';

export function useCurrencyConverterLogic({ initialAmount, initialFrom, initialTo, initialFavorites }) {
  // --- States المتعلقة بالبيانات الأساسية ---
  const [currencies, setCurrencies] = useState([]);
  const [currencyNames, setCurrencyNames] = useState({});
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);

  // --- States المتعلقة بإدخال المستخدم ---
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialTo);
  const [favorites, setFavorites] = useState(initialFavorites); // Should be a Set

  // --- States المتعلقة بنتيجة التحويل ---
  const [convertedResult, setConvertedResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [reverseExchangeRate, setReverseExchangeRate] = useState(null);
  const [converting, setConverting] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // --- States لوضع التحويل المتعدد ---
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [multiToCurrencies, setMultiToCurrencies] = useState([]);
  const [multiResult, setMultiResult] = useState(null);

  // --- جلب العملات وأسمائها ---
  const fetchCurrenciesAndNames = async () => {
    // Don't show skeleton if data might already be loaded (e.g., from cache or previous state)
    if (currencies.length > 0 && Object.keys(currencyNames).length > 0) {
      setIsLoadingCurrencies(false);
      return;
    }
    setIsLoadingCurrencies(true);
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencyNames(data);
      setCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching Currencies", error);
      toast.error("Could not load currencies.");
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  useEffect(() => {
    fetchCurrenciesAndNames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // --- حفظ الحالة في LocalStorage ---
  useEffect(() => { if(amount) localStorage.setItem('last_amount', amount); }, [amount]);
  useEffect(() => { localStorage.setItem('last_from', fromCurrency); }, [fromCurrency]);
  useEffect(() => { localStorage.setItem('last_to', toCurrency); }, [toCurrency]);
  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(Array.from(favorites))); }, [favorites]);

  // --- دالة التحويل الأساسية ---
  const convertCurrency = async () => {
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (!numericAmount || numericAmount === 0) {
        toast.error("Please enter a valid amount.");
        return;
    }
    setConverting(true);
    setConvertedResult(null);
    setMultiResult(null);
    setExchangeRate(null);
    setReverseExchangeRate(null);
    setShowChart(false);

    const apiAmount = amount.replace(/,/g, ''); // Use raw amount for API

    if (isMultiMode) {
      if (multiToCurrencies.length === 0) {
        toast.error("Please select at least one currency.");
        setConverting(false);
        return;
      }
      const toQuery = multiToCurrencies.map(opt => opt.value).join(',');
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${apiAmount}&from=${fromCurrency}&to=${toQuery}`
        );
        if (!res.ok) throw new Error("API error.");
        const data = await res.json();
        if (!data.rates) throw new Error("Invalid data.");
        setMultiResult(data.rates);
      } catch (error) {
        console.error("Error Fetching Multi-Rates", error);
        toast.error("Failed to get multi-rates.");
      } finally {
        setConverting(false);
      }
    } else {
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${apiAmount}&from=${fromCurrency}&to=${toCurrency}`
        );
        if (!res.ok) throw new Error("API error.");
        const data = await res.json();
        if (!data.rates || !data.rates[toCurrency]) throw new Error("Invalid data.");

        const totalResult = data.rates[toCurrency];
        const ratePerUnit = totalResult / numericAmount;
        const reverseRate = 1 / ratePerUnit;

        setConvertedResult(totalResult.toFixed(2));
        setExchangeRate(ratePerUnit.toFixed(6));
        setReverseExchangeRate(reverseRate.toFixed(6));
      } catch (error) {
        console.error("Error Fetching Rate", error);
        toast.error("Failed to get rate.");
      } finally {
        setConverting(false);
      }
    }
  };

  // --- الدوال المساعدة ---
  const toggleMode = () => {
    const nextIsMultiMode = !isMultiMode;
    setIsMultiMode(nextIsMultiMode);
    setConvertedResult(null);
    setMultiResult(null);
    setShowChart(false);
    if (!nextIsMultiMode) { // If switching back to single
      setToCurrency(localStorage.getItem('last_to') || "INR");
    } else { // If switching to multi
        // Pre-fill multi-select with favorites when switching to multi-mode
        setMultiToCurrencies(
            currencyOptions.filter(opt => favorites.has(opt.value)) // Use Set.has for check
        );
    }
  };


  const swapCurrencies = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const displayAmount = useMemo(() => {
    if (amount === "") return "";
    if (/\.$/.test(amount)) {
      // Handle trailing decimal point
      const numPart = amount.slice(0, -1);
      return Number(numPart).toLocaleString('en-US') + ".";
    }
    if (amount.includes('.')) {
      // Handle numbers with decimal part
      const parts = amount.split('.');
      return Number(parts[0]).toLocaleString('en-US') + "." + (parts[1] || "");
    }
    // Handle integer numbers
    const num = Number(amount);
    return isNaN(num) ? "" : num.toLocaleString('en-US');
  }, [amount]);


  const currencyOptions = useMemo(() => {
    return currencies.map(curr => ({
      value: curr,
      label: `${curr} - ${currencyNames[curr] || '...'}`,
      isFavorite: favorites.has(curr) // Use Set.has for efficiency
    }));
  }, [currencies, currencyNames, favorites]);

   const handleFavoriteToggle = (currency) => {
    setFavorites(prev => {
        const next = new Set(prev); // Work with Set internally
        if (next.has(currency)) {
            next.delete(currency);
            toast.error(`${currency} removed from favorites`);
        } else {
            next.add(currency);
            toast.success(`${currency} added to favorites!`);
        }
        return next;
    });
   };

   const isFavoriteCheck = (curr) => favorites.has(curr); // Use Set.has


  // --- القيم والدوال اللي هنرجعها للـ UI ---
  return {
    // States
    isLoadingCurrencies,
    isMultiMode,
    amount, // Raw amount
    fromCurrency,
    toCurrency,
    favorites: Array.from(favorites), // Return as Array for compatibility if needed elsewhere
    convertedResult,
    exchangeRate,
    reverseExchangeRate,
    multiResult,
    converting,
    showChart,
    multiToCurrencies,
    currencyOptions,
    displayAmount, // Formatted amount for display

    setFromCurrency,
    setToCurrency,
    handleFavorite: handleFavoriteToggle,
    isFavorite: isFavoriteCheck,
    setMultiToCurrencies,
    handleAmountChange, // Pass the handler instead of raw setter
    setShowChart,

    convertCurrency,
    swapCurrencies,
    toggleMode,
  };
}