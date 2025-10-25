
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-bold text-gray-800 dark:text-white text-sm">{label}</p>
        <p className="text-green-600 dark:text-green-400 text-sm">{`Rate: ${payload[0].value.toFixed(4)}`}</p>
      </div>
    );
  }
  return null;
};

export default function RateChart({ from, to }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!from || !to) return;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      setChartData([]);
      const date = new Date();
      const today = date.toISOString().split('T')[0];
      date.setDate(date.getDate() - 30);
      const thirtyDaysAgo = date.toISOString().split('T')[0];

      try {
        const res = await fetch(
          `https://api.frankfurter.app/${thirtyDaysAgo}..${today}?from=${from}&to=${to}`
        );
        if (!res.ok) throw new Error("Failed to fetch historical data.");
        const data = await res.json();
        if (!data.rates) throw new Error("No historical data found.");

        const formattedData = Object.keys(data.rates)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => ({
            date: date,
            rate: data.rates[date][to],
          }));
        
        setChartData(formattedData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [from, to]);


  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-4">Loading chart data...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 dark:text-red-400 p-4">{error}</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
        
        <XAxis 
          dataKey="date" 
          fontSize={9} 
          tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', {day: '2-digit', month: 'short'})}
          stroke="#6b7280"
        />
        
        <YAxis 
          domain={['dataMin', 'dataMax']} 
          fontSize={9} 
          stroke="#6b7280"
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        <Line 
          type="monotone" 
          dataKey="rate" 
          stroke="#16a34a"
          strokeWidth={2} 
          dot={false} 
          activeDot={{ r: 5 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}