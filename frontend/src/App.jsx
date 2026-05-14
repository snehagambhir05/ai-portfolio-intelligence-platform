import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

import { useEffect, useState } from "react";

import API from "./services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const [ticker, setTicker] = useState("AAPL");

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {

  if (!ticker.trim()) return;

  try {

    setLoading(true);

    const response = await API.get(`/stock/${ticker}`);

    if (response.data.error) {

      setStock({
        ticker: ticker,
        avg_return: 0,
        volatility: 0,
        sharpe_ratio: 0,
        dates: [],
        closing_prices: [],
        simulations: [[]],
        lstm_predictions: []
      });

    } else {

      setStock(response.data);

    }

  } catch (error) {

    console.error(error);

    setStock({
      ticker: ticker,
      avg_return: 0,
      volatility: 0,
      sharpe_ratio: 0,
      dates: [],
      closing_prices: [],
      simulations: [[]],
      lstm_predictions: []
    });

  } finally {

    setLoading(false);

  }
};

  const chartData = stock
    ? stock.dates.map((date, index) => ({
        date,
        price: stock.closing_prices[index],
      }))
    : [];

  const forecastData = stock
  ? stock.lstm_predictions.map((price, index) => ({
      day: `Day ${index + 1}`,
      predicted: price,
    }))
  : [];

const generateInsight = () => {

  if (!stock) return "";

  if (stock.sharpe_ratio > 1) {

    return "Strong risk-adjusted returns detected. Portfolio momentum appears bullish.";

  }

  if (stock.volatility > 2) {

    return "High volatility detected. Risk exposure may increase significantly.";

  }

  return "Moderate market conditions detected with balanced risk-reward characteristics.";
};

  return (

    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">

        <Topbar
  ticker={ticker}
  setTicker={setTicker}
  fetchStock={fetchStock}
/>
{loading && (

  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

    <p className="text-slate-300 text-lg">
      Fetching AI analytics...
    </p>

  </div>

)}

        {stock && (

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">

            <h2 className="text-4xl font-bold mb-8">
              {stock.ticker}
            </h2>
            <div id="portfolio">

            {/* KPI CARDS */}

            <div className="grid grid-cols-3 gap-5 mb-10">

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300">

                <p className="text-sm text-slate-400 mb-2">
                  Average Return
                </p>

                <h3 className="text-3xl text-green-400 font-bold">
                  {stock.avg_return}%
                </h3>

              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300">

                <p className="text-sm text-slate-400 mb-2">
                  Volatility
                </p>

                <h3 className="text-3xl text-yellow-400 font-bold">
                  {stock.volatility}%
                </h3>
          

              </div>

              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300">

                <p className="text-sm text-slate-400 mb-2">
                  Sharpe Ratio
                </p>

                <h3 className="text-3xl text-blue-400 font-bold">
                  {stock.sharpe_ratio}
                </h3>
                </div>

              </div>

            </div>
            <div id="analytics">

            {/* MAIN STOCK CHART */}

            <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700 p-6 rounded-3xl mb-10">

              <h2 className="text-2xl font-semibold mb-6">
                Historical Price Analysis
              </h2>

              <ResponsiveContainer width="100%" height={320}>

                <LineChart data={chartData}>

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={false}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            {/* TWO CHART GRID */}

            <div className="grid grid-cols-2 gap-6">

              {/* MONTE CARLO */}

              <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-700 p-6 rounded-3xl">

                <h2 className="text-2xl font-semibold mb-6">
                  Monte Carlo Simulation
                </h2>

                <ResponsiveContainer width="100%" height={260}>

                  <LineChart
                    data={
                      stock.simulations?.[0]?.map((_, index) => {

                        const point = { day: index };

                        stock.simulations.forEach((sim, simIndex) => {

                          point[`sim${simIndex}`] = sim[index];

                        });

                        return point;
                      })
                    }
                  >

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    {stock.simulations?.map((_, index) => (

                      <Line
                        key={index}
                        type="monotone"
                        dataKey={`sim${index}`}
                        dot={false}
                        strokeWidth={1}
                      />

                    ))}

                  </LineChart>

                </ResponsiveContainer>

              </div>

              {/* AI FORECAST */}

              <div
  id="forecast"
  className="bg-slate-800/40 backdrop-blur-lg border border-slate-700 p-6 rounded-3xl"
>

                <h2 className="text-2xl font-semibold mb-6">
                  AI Forecast (LSTM)
                </h2>

                <ResponsiveContainer width="100%" height={260}>

                  <LineChart data={forecastData}>

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#60a5fa"
                      strokeWidth={4}
                      dot={false}
                    />

                  </LineChart>

                </ResponsiveContainer>
                </div>

              </div>

            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl mt-8">

              <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                AI Insights
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed">

                {generateInsight()}

              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default App;