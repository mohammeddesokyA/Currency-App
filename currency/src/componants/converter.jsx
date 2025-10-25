// ملف: componants/converter.jsx

import { useEffect, useState, useMemo } from "react";
import RateChart from './RateChart'; 
import { toast } from 'react-hot-toast'; 
import { 
  HiArrowsRightLeft, 
  HiOutlineClipboardDocument, 
  HiChartBar, 
  HiUsers, 
  HiUser,
  HiOutlineStar, 
  HiStar 
} from "react-icons/hi2";
import Select from 'react-select'; 
import MultiResultDisplay from './MultiResultDisplay';
import ConverterSkeleton from './ConverterSkeleton'; 

const CurrencyConverter = ({ favorites, handleFavorite, toCurrency, setToCurrency }) => {
  
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [multiToCurrencies, setMultiToCurrencies] = useState([]);
  const [multiResult, setMultiResult] = useState(null);
  const [currencies, addCurrencies] = useState([]);
  const [amount, addAmount] = useState(() => localStorage.getItem('last_amount') || "1"); 
  const [fromCurrency, addFromCurrency] = useState(() => localStorage.getItem('last_from') || "USD");
  const [convertedResult, setConvertedResult] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [reverseExchangeRate, setReverseExchangeRate] = useState(null);
  const [converting, addConverting] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [currencyNames, setCurrencyNames] = useState({});

  const currencyOptions = useMemo(() => {
    return currencies.map(curr => ({
      value: curr, 
      label: `${curr} - ${currencyNames[curr] || '...'}`,
      isFavorite: favorites.includes(curr)
    }));
  }, [currencies, currencyNames, favorites]);

  const fetchCurrenciesAndNames = async () => { 
    if (currencies.length > 0 && Object.keys(currencyNames).length > 0) {
      setIsLoadingCurrencies(false);
      return;
    }
    setIsLoadingCurrencies(true);
    try {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencyNames(data);
      addCurrencies(Object.keys(data));
    } catch (error) {
      console.error("Error Fetching", error);
      toast.error("Could not load currencies.");
    } finally {
      setIsLoadingCurrencies(false);
    }
  };
  
  useEffect(() => {
    fetchCurrenciesAndNames();
  }, []);

  useEffect(() => { if(amount) localStorage.setItem('last_amount', amount); }, [amount]);
  useEffect(() => { localStorage.setItem('last_from', fromCurrency); }, [fromCurrency]);

  
  const convertCurrency = async () => { 
    if (!amount || parseFloat(amount) === 0) {
        toast.error("Please enter a valid amount.");
        return;
    }
    addConverting(true);
    setConvertedResult(null); 
    setMultiResult(null); 
    setExchangeRate(null);    
    setReverseExchangeRate(null);
    setShowChart(false);

    if (isMultiMode) {
      if (multiToCurrencies.length === 0) {
        toast.error("Please select at least one currency.");
        addConverting(false);
        return;
      }
      const toQuery = multiToCurrencies.map(opt => opt.value).join(',');
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toQuery}`
        );
        if (!res.ok) throw new Error("API error.");
        const data = await res.json();
        if (!data.rates) throw new Error("Invalid data.");
        setMultiResult(data.rates);
      } catch (error) {
        console.error("Error Fetching", error);
        toast.error("Failed to get multi-rates."); 
      } finally {
        addConverting(false);
      }
    } else {
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        if (!res.ok) throw new Error("API error.");
        const data = await res.json();
        if (!data.rates || !data.rates[toCurrency]) throw new Error("Invalid data.");

        const totalResult = data.rates[toCurrency];
        const ratePerUnit = totalResult / parseFloat(amount);
        const reverseRate = 1 / ratePerUnit;

        setConvertedResult(totalResult.toFixed(2));
        setExchangeRate(ratePerUnit.toFixed(6));    
        setReverseExchangeRate(reverseRate.toFixed(6));
      } catch (error) {
        console.error("Error Fetching", error);
        toast.error("Failed to get rate."); 
      } finally {
        addConverting(false);
      }
    }
  };

  const toggleMode = () => {
    setIsMultiMode(!isMultiMode);
    setConvertedResult(null);
    setMultiResult(null);
    setShowChart(false);
    if(isMultiMode) {
      setToCurrency(localStorage.getItem('last_to') || "INR");
    } else {
      setMultiToCurrencies(
        currencyOptions.filter(opt => opt.isFavorite)
      );
    }
  };

  const swapCurrencies = () => { 
    const oldFrom = fromCurrency;
    addFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };
  
  const handleCopy = () => { 
    if (!convertedResult) return;
    navigator.clipboard.writeText(convertedResult)
      .then(() => toast.success('Amount copied!'))
      .catch(err => toast.error('Failed to copy.'));
  };

  const handleAmountChange = (e) => { 
    const value = e.target.value.replace(/,/g, '');
    if (value === "" || /^\d*\.?\d*$/.test(value)) { 
      addAmount(value);
    }
  };
  
  const displayAmount = useMemo(() => { 
    if (amount === "") return "";
    if (/\.$/.test(amount)) {
      return Number(amount.slice(0, -1)).toLocaleString('en-US') + ".";
    }
    if (/\.\d+$/.test(amount)) {
      const parts = amount.split('.');
      return Number(parts[0]).toLocaleString('en-US') + "." + (parts[1] || "");
    }
    const num = Number(amount);
    return isNaN(num) ? "" : num.toLocaleString('en-US');
  }, [amount]);
  
  const isFavorite = (curr) => favorites.includes(curr);

  const customSelectStyles = {
    control: (styles, { isFocused }) => ({ 
      ...styles, 
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: isFocused ? '2px solid #10B981' : '1px solid #e5e7eb',
      boxShadow: 'none',
      paddingRight: isMultiMode ? '0.5rem' : '2.5rem', 
      minHeight: '42px', 
      '&:hover': { borderColor: '#e5e7eb' },
      '.dark &': {
        backgroundColor: 'rgba(55, 65, 81, 0.5)',
        border: isFocused ? '2px solid #10B981' : '1px solid #4b5563',
        '&:hover': { borderColor: '#4b5563' },
      }
    }),
    menu: (styles) => ({ 
      ...styles, 
      zIndex: 20, 
      backgroundColor: '#ffffff',
      '.dark &': { backgroundColor: '#1f2937' }
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? '#10B981' : isFocused ? '#D1FAE5' : 'transparent',
      color: isSelected ? 'white' : '#111827',
      '&:active': { backgroundColor: '#059669' },
      '.dark &': {
        backgroundColor: isSelected ? '#10B981' : isFocused ? '#1D4ED8' : 'transparent',
        color: isSelected ? 'white' : '#f3f4f6',
        '&:active': { backgroundColor: '#059669' },
      }
    }),
    multiValue: (styles) => ({ ...styles, backgroundColor: '#D1FAE5', '.dark &': { backgroundColor: '#1E40AF' } }),
    multiValueLabel: (styles, { data }) => ({ 
      ...styles, 
      color: '#064E3B', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px',
      '.dark &': { color: '#DBEAFE' } 
    }),
    multiValueRemove: (styles) => ({ ...styles, color: '#064E3B', ':hover': { backgroundColor: '#10B981', color: 'white' }, '.dark &': { color: '#DBEAFE', ':hover': { backgroundColor: '#10B981', color: 'white' },} }),
    input: (styles) => ({ ...styles, color: '#111827', '.dark &': { color: '#f3f4f6' } }),
    singleValue: (styles) => ({ ...styles, display: 'flex', alignItems: 'center', color: '#111827', '.dark &': { color: '#f3f4f6' } }), 
    placeholder: (styles) => ({ ...styles, color: '#6b7280', '.dark &': { color: '#9ca3af' } }),
    indicatorsContainer: () => ({ display: 'none' }), 
  };

  if (isLoadingCurrencies) {
    return <ConverterSkeleton />;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto my-10 p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-2xl backdrop-filter backdrop-blur-lg animate-popIn">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Currency Converter {isMultiMode ? "(Multi)" : "(Single)"}
          </h2>
          <button
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gray-200/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isMultiMode ? <HiUser className="h-5 w-5" /> : <HiUsers className="h-5 w-5" />}
            {isMultiMode ? "Single" : "Multi"}
          </button>
        </div>
        
        <p className="mb-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          A fast, accurate currency converter powered by a free exchange rate API.
        </p>

        <div className="flex flex-col gap-4 sm:gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input 
              value={displayAmount} 
              onChange={handleAmountChange} 
              type="text" 
              inputMode="decimal" 
              className="w-full p-3 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            
            <div className={`${isMultiMode ? 'col-span-full' : 'col-span-full sm:col-span-2'}`}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
              <div className="relative">
                <Select
                  options={currencyOptions}
                  value={currencyOptions.find(opt => opt.value === fromCurrency)}
                  onChange={(opt) => addFromCurrency(opt.value)}
                  styles={customSelectStyles}
                  isSearchable={true}
                />
                {!isMultiMode && (
                  <button
                    onClick={() => handleFavorite(fromCurrency)}
                    className="absolute top-0 right-3 h-full flex items-center text-sm leading-5 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 z-10"
                  >
                    {isFavorite(fromCurrency) ? (
                      <HiStar className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <HiOutlineStar className="h-5 w-5 transition-colors duration-300" />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {!isMultiMode && (
              <div className="flex justify-center col-span-full sm:col-span-1">
                <button onClick={swapCurrencies} className="p-3 text-gray-700 dark:text-gray-300 rounded-full bg-white/60 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all transform hover:scale-105 focus:outline-none">
                  <HiArrowsRightLeft className="text-xl" />
                </button>
              </div>
            )}

            {/* To Input */}
            <div className={`${isMultiMode ? 'col-span-full' : 'col-span-full sm:col-span-2'}`}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
              {isMultiMode ? (
                <Select
                  options={currencyOptions}
                  value={multiToCurrencies}
                  onChange={setMultiToCurrencies}
                  styles={customSelectStyles}
                  isSearchable={true}
                  isMulti={true}
                  placeholder="Select currencies (e.g. favorites)"
                />
              ) : (
                <div className="relative">
                  <Select
                    options={currencyOptions}
                    value={currencyOptions.find(opt => opt.value === toCurrency)}
                    onChange={(opt) => setToCurrency(opt.value)}
                    styles={customSelectStyles}
                    isSearchable={true}
                  />
                  <button
                    onClick={() => handleFavorite(toCurrency)}
                    className="absolute top-0 right-3 h-full flex items-center text-sm leading-5 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 focus:outline-none transition-all duration-300 transform hover:scale-110 active:scale-95 z-10"
                  >
                    {isFavorite(toCurrency) ? (
                      <HiStar className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <HiOutlineStar className="h-5 w-5 transition-colors duration-300" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <button 
              onClick={convertCurrency} 
              className={`w-full px-8 py-3 text-white font-bold text-lg rounded-full shadow-lg shadow-green-500/30 dark:shadow-green-800/30 transition-all transform bg-green-600 hover:bg-green-700 focus:outline-none ${converting ? "animate-pulse" : "hover:scale-105"}`} 
              disabled={converting} 
            >
              {converting ? "Converting..." : "Convert"}
            </button>
          </div>
        </div> 
      </div>
      
      {convertedResult && !isMultiMode && (
        <div className="max-w-2xl w-full mx-auto mt-6 bg-green-50/70 dark:bg-gray-900/70 rounded-2xl shadow-xl backdrop-filter backdrop-blur-lg border border-green-500/50 dark:border-green-600/50 animate-popIn">
          <div className="p-4 sm:p-6"> 
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Converted amount</p>
              <button onClick={handleCopy} className="flex items-center gap-1 text-sm text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 transition-colors">
                <HiOutlineClipboardDocument className="h-4 w-4" />
                Copy
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {toCurrency} {convertedResult}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1">
              <p>{displayAmount} {fromCurrency} = {convertedResult} {toCurrency}</p> 
              <p>1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
              <p>1 {toCurrency} = {reverseExchangeRate} {fromCurrency}</p>
            </div>
          </div>
          <div className="border-t border-green-500/30 dark:border-green-600/30 p-4 sm:px-6 sm:py-4">
            <button 
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300"
            >
              <HiChartBar className="h-5 w-5" />
              {showChart ? "Hide" : "Show"} 30-Day History
            </button>
            {showChart && (
              <div className="mt-4">
                <RateChart from={fromCurrency} to={toCurrency} />
              </div>
            )}
          </div>
        </div>
      )}
      
      {multiResult && isMultiMode && (
        <MultiResultDisplay 
          results={multiResult} 
          from={fromCurrency} 
          amount={displayAmount} 
        />
      )}
    </>
  );
};

export default CurrencyConverter;