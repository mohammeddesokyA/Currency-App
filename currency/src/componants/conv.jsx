import { useState } from "react";
import { ArrowsLeftRight } from "lucide-react";

export default function ConverterUI() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Convert currencies instantly
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          A fast, accurate currency converter powered by a free exchange rate API.
          Clean design, responsive layout, and robust error handling.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <div className="flex items-center justify-between gap-3">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>USD — Dollar</option>
              <option>EUR — Euro</option>
              <option>GBP — Pound</option>
              <option>EGP — Egyptian Pound</option>
            </select>

            <button
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              onClick={() => {
                const temp = from;
                setFrom(to);
                setTo(temp);
              }}
            >
              <ArrowsLeftRight className="w-5 h-5 text-gray-700" />
            </button>

            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-gray-300 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option>EUR — Euro</option>
              <option>USD — Dollar</option>
              <option>GBP — Pound</option>
              <option>EGP — Egyptian Pound</option>
            </select>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl py-3 mt-2 transition">
            Convert
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Exchange rates by frankfurter.app. Results are for informational purposes only.
      </p>
    </div>
  );
}
