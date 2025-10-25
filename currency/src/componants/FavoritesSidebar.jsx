
import React from 'react';
import { HiCheck, HiXMark } from 'react-icons/hi2';

export default function FavoritesSidebar({ favorites, setToCurrency, handleFavorite }) {
  
  const favList = Array.from(favorites);

  return (
    <div className="w-full lg:w-48 p-4 sm:p-6 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-2xl backdrop-filter backdrop-blur-lg animate-popIn">
      
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Favorites
      </h3>

      {favList.length > 0 ? (
        <div className="flex flex-col gap-3">
          {favList.map((fav) => (
            <div 
              key={fav} 
              className="group flex items-center justify-between p-2 rounded-md bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200/70 dark:hover:bg-gray-600/70 transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">{fav}</span>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                
                <button 
                  onClick={() => setToCurrency(fav)}
                  title={`Use ${fav} as 'To' currency`}
                  className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-gray-800 rounded"
                >
                  <HiCheck className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={() => handleFavorite(fav)}
                  title={`Remove ${fav} from favorites`}
                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-gray-800 rounded"
                >
                  <HiXMark className="h-4 w-4" />
                </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No favorites added yet.</p>
      )}
    </div>
  );
}