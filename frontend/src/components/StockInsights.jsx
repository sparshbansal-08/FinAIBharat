import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

function StockInsights() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const chartRef = useRef(null);

  const stockList = [
    { name: "Reliance Industries", symbol: "RELIANCE.NS" }, // Energy/Conglomerate
    { name: "Tata Consultancy Services", symbol: "TCS.NS" }, // IT Services
    { name: "HDFC Bank", symbol: "HDFCBANK.NS" }, // Banking
    { name: "Infosys", symbol: "INFY.NS" }, // IT Services
    { name: "State Bank of India", symbol: "SBIN.NS" }, // Banking
    { name: "ICICI Bank", symbol: "ICICIBANK.NS" }, // Banking
    { name: "Bajaj Finance", symbol: "BAJFINANCE.NS" }, // Financial Services
    { name: "Tata Motors", symbol: "TATAMOTORS.NS" }, // Automotive
    { name: "Maruti Suzuki India", symbol: "MARUTI.NS" }, // Automotive
    { name: "Hindustan Unilever", symbol: "HINDUNILVR.NS" }, // Consumer Goods
    { name: "ITC Limited", symbol: "ITC.NS" }, // Conglomerate (Tobacco/FMCG)
    { name: "Bharti Airtel", symbol: "BHARTIARTL.NS" }, // Telecom
    { name: "Axis Bank", symbol: "AXISBANK.NS" }, // Banking
    { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK.NS" }, // Banking
    { name: "Asian Paints", symbol: "ASIANPAINT.NS" }, // Paints/Chemicals
    { name: "Larsen & Toubro", symbol: "LT.NS" }, // Infrastructure/Engineering
    { name: "Adani Enterprises", symbol: "ADANIENT.NS" }, // Conglomerate
    { name: "Sun Pharmaceutical", symbol: "SUNPHARMA.NS" }, // Pharmaceuticals
    { name: "HCL Technologies", symbol: "HCLTECH.NS" }, // IT Services
    { name: "Titan Company", symbol: "TITAN.NS" }, // Jewelry/Consumer Goods
    { name: "Adani Ports & SEZ", symbol: "ADANIPORTS.NS" }, // Infrastructure/Ports
    { name: "Wipro", symbol: "WIPRO.NS" }, // IT Services
    { name: "Nestlé India", symbol: "NESTLEIND.NS" }, // Consumer Goods/Food
    { name: "Dr. Reddy's Laboratories", symbol: "DRREDDY.NS" }, // Pharmaceuticals
    { name: "Bajaj Auto", symbol: "BAJAJ-AUTO.NS" }, // Automotive
    { name: "Tech Mahindra", symbol: "TECHM.NS" }, // IT Services
    { name: "Cipla", symbol: "CIPLA.NS" }, // Pharmaceuticals
    { name: "Eicher Motors", symbol: "EICHERMOT.NS" }, // Automotive
    { name: "UltraTech Cement", symbol: "ULTRACEMCO.NS" }, // Cement
    { name: "Mahindra & Mahindra", symbol: "M&M.NS" }, // Automotive
    { name: "Power Grid Corporation", symbol: "POWERGRID.NS" }, // Energy/Utilities
    { name: "NTPC Limited", symbol: "NTPC.NS" }, // Energy/Power
    { name: "JSW Steel", symbol: "JSWSTEEL.NS" }, // Steel/Metals
    { name: "Tata Steel", symbol: "TATASTEEL.NS" }, // Steel/Metals
    { name: "Grasim Industries", symbol: "GRASIM.NS" }, // Conglomerate/Cement
    { name: "Britannia Industries", symbol: "BRITANNIA.NS" }, // Consumer Goods/Food
    { name: "Shree Cement", symbol: "SHREECEM.NS" }, // Cement
    { name: "Divi's Laboratories", symbol: "DIVISLAB.NS" }, // Pharmaceuticals
    { name: "Hero MotoCorp", symbol: "HEROMOTOCO.NS" }, // Automotive
    { name: "Oil & Natural Gas Corporation", symbol: "ONGC.NS" }, // Energy/Oil
  ];

  // Fetch stock data
  const fetchStockData = async (symbol) => {
    try {
      const response = await fetch(
        "https://finaibharat.onrender.com/getStockData",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setSelectedStock({ error: data.error });
        setChartData(null);
      } else {
        setSelectedStock(data);
        fetchHistoricalData(symbol);
        fetchAIInsight(symbol, data);
      }
      setSuggestions([]);
      setSearchInput(
        stockList.find((s) => s.symbol === symbol)?.name || symbol
      );
    } catch (error) {
      setSelectedStock({ error: "Failed to load stock data." });
      setChartData(null);
    }
  };

  // Fetch historical data (mocked)
  const fetchHistoricalData = (symbol) => {
    const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
    const prices = Array.from(
      { length: 30 },
      () => Math.random() * 1000 + 2000
    );
    setChartData({
      labels,
      datasets: [
        {
          label: `${symbol} Price (₹)`,
          data: prices,
          borderColor: "rgba(0, 255, 0, 0.8)",
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    });
  };

  // Fetch AI-driven insight
  const fetchAIInsight = async (symbol, stockData) => {
    try {
      const response = await fetch(
        "https://finaibharat.onrender.com/getResponse",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "User",
            goal: "Stock Analysis",
            risk: "medium",
            horizon: "medium",
            problem: `Provide a detailed investment insight for ${symbol} with current price ₹${stockData.price}, change ₹${stockData.change} (${stockData.changePercent}%).`,
            language: "English",
          }),
        }
      );
      const data = await response.json();
      setAiInsight(data.response);
    } catch (error) {
      setAiInsight("Couldn’t fetch AI insight.");
    }
  };

  // Suggest stocks
  const suggestStocks = (input) => {
    if (!input) {
      setSuggestions([]);
      setSelectedStock(null);
      setChartData(null);
      setAiInsight("");
      return;
    }
    const matches = stockList.filter(
      (stock) =>
        stock.name.toLowerCase().includes(input.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(matches);
  };

  // Add to watchlist
  const addToWatchlist = () => {
    if (
      selectedStock &&
      !selectedStock.error &&
      !watchlist.some((item) => item.symbol === selectedStock.symbol)
    ) {
      setWatchlist([...watchlist, selectedStock]);
    }
  };

  // Cleanup chart
  useEffect(() => {
    const currentChart = chartRef.current; // Capture the ref value
    return () => {
      if (currentChart && currentChart.chartInstance) {
        currentChart.chartInstance.destroy();
      }
    };
  }, [chartData]);

  return (
    <section className="stock-insights">
      <h2>Stock Insights</h2>
      <p className="tagline">
        Dive into India’s markets with real-time data and AI insights.
      </p>

      {/* Search Bar */}
      <div className="stock-search">
        <input
          type="text"
          className="stock-search-input"
          placeholder="Search stocks (e.g., Reliance)"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            suggestStocks(e.target.value);
          }}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            suggestions.length > 0 &&
            fetchStockData(suggestions[0].symbol)
          }
        />
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((stock) => (
              <div
                key={stock.symbol}
                className="suggestion-item"
                onClick={() => fetchStockData(stock.symbol)}
              >
                {stock.name} ({stock.symbol})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock Dashboard */}
      {selectedStock && (
        <div className="stock-dashboard">
          {/* Stock Details */}
          <div className="stock-details-card">
            {selectedStock.error ? (
              <p>{selectedStock.error}</p>
            ) : (
              <>
                <h3>
                  {selectedStock.name} ({selectedStock.symbol})
                </h3>
                <p className="price">₹{selectedStock.price}</p>
                <p
                  className={`change ${
                    selectedStock.change >= 0 ? "positive" : "negative"
                  }`}
                >
                  {selectedStock.change} ({selectedStock.changePercent}%)
                </p>
                <button className="watchlist-btn" onClick={addToWatchlist}>
                  Add to Watchlist
                </button>
              </>
            )}
          </div>

          {/* Chart and AI Insight Container */}
          <div className="stock-analysis-container">
            {/* Chart */}
            <div className="stock-graph">
              {chartData ? (
                <Line
                  ref={chartRef}
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" },
                      tooltip: { mode: "index", intersect: false },
                    },
                    scales: {
                      x: { title: { display: true, text: "Time" } },
                      y: {
                        title: { display: true, text: "Price (₹)" },
                        beginAtZero: false,
                      },
                    },
                    animation: {
                      duration: 1500,
                      easing: "easeInOutQuad",
                    },
                  }}
                />
              ) : (
                <p>Select a stock to view its chart.</p>
              )}
            </div>

            {/* AI Insight */}
            <div className="ai-insight">
              <h4>AI Insight</h4>
              <div className="ai-insight-content">
                <p
                  dangerouslySetInnerHTML={{
                    __html: aiInsight || "Loading insight...",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watchlist */}
      {watchlist.length > 0 && (
        <div className="watchlist">
          <h3>Your Watchlist</h3>
          <div className="watchlist-items">
            {watchlist.map((stock) => (
              <div key={stock.symbol} className="watchlist-item">
                <span>
                  {stock.name} ({stock.symbol})
                </span>
                <span>₹{stock.price}</span>
                <span className={stock.change >= 0 ? "positive" : "negative"}>
                  {stock.change} ({stock.changePercent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default StockInsights;
