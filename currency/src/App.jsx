import React from 'react';
import CurrencyConverter from './componants/converter';
import Footer from './componants/footer';
function App() {
  return (
    <div className="min-h-screen flex bg-gray-200 flex-col items-center justify-center">
  <div className="container">
      <Footer />
      <CurrencyConverter />
      </div>
    </div>
  );
}

export default App;
