
import React, { useState, useEffect } from 'react';
import CurrencyConverter from './componants/converter';
import Footer from './componants/footer';
import Header from './componants/Header';
import { getInitialTheme, applyTheme } from './lib/theme'; 
import FavoritesSidebar from './componants/FavoritesSidebar';
import { Toaster, toast } from 'react-hot-toast'; 
import { HiXMark } from 'react-icons/hi2';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme() === 'dark');
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || ["INR", "EUR"]
  );
  const [toCurrency, setToCurrency] = useState(
    () => localStorage.getItem('last_to') || "INR"
  );
  const [mobileFavoritesOpen, setMobileFavoritesOpen] = useState(false);

  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];
    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
      toast.error(`${currency} removed from favorites`);
    } else {
      updatedFavorites.push(currency);
      toast.success(`${currency} added to favorites!`);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useEffect(() => { applyTheme(isDarkMode ? 'dark' : 'light'); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('last_to', toCurrency); }, [toCurrency]);

  const toggleTheme = () => { setIsDarkMode(!isDarkMode); };
  const toggleMobileFavorites = () => { setMobileFavoritesOpen(!mobileFavoritesOpen); };
  
  const handleSetToCurrency = (currency) => {
    setToCurrency(currency);
    setMobileFavoritesOpen(false); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-cover bg-center relative" style={{ backgroundImage: `url('/pexels-eslames1-28310142.jpg')` }}>
      
      <Toaster position="top-center" reverseOrder={false} />

      {isDarkMode && <div className="absolute inset-0 bg-black bg-opacity-50"></div>}
      
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        toggleMobileFavorites={toggleMobileFavorites} 
      />

      <div className="container flex flex-col items-center justify-start flex-grow relative z-10 px-4 w-full pt-24 pb-12">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full max-w-4xl"> 
            
            <div className="w-full lg:w-auto">
              <CurrencyConverter 
                favorites={favorites}
                handleFavorite={handleFavorite}
                toCurrency={toCurrency}
                setToCurrency={setToCurrency}
              />
            </div>
            
            <div className="w-full lg:w-auto lg:sticky lg:top-28 hidden lg:block"> 
              <FavoritesSidebar 
                favorites={favorites}
                handleFavorite={handleFavorite}
                setToCurrency={setToCurrency}
              />
            </div>
        </div>
      </div>

      {mobileFavoritesOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={toggleMobileFavorites}
        >
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <FavoritesSidebar 
              favorites={favorites}
              handleFavorite={handleFavorite}
              setToCurrency={handleSetToCurrency} 
            />
            <button 
              onClick={toggleMobileFavorites}
              className="absolute -top-3 -right-3 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg"
            >
              <HiXMark className="h-6 w-6 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;