const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const NodeCache = require("node-cache");
const fetch = require("node-fetch").default;

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 600 });

const genAI = new GoogleGenerativeAI("AIzaSyAw2aHnaXWAE_qgk_BMNmG5iB5jjHLKDAQ");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("FinAI Bharat API is running!");
});

async function fetchIndianStockData(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.chart.result) {
    return { error: "Stock data not found" };
  }
  const meta = data.chart.result[0].meta;
  return {
    symbol: meta.symbol,
    name: symbol.split(".")[0],
    price: meta.regularMarketPrice.toFixed(2),
    change: (meta.regularMarketPrice - meta.previousClose).toFixed(2),
    changePercent: (
      ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) *
      100
    ).toFixed(2),
  };
}

app.post("/getResponse", async (req, res) => {
  const { name, goal, risk, horizon, problem, language } = req.body;
  const cacheKey = `${name}-${goal}-${risk}-${horizon}-${problem}-${language}`;
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    return res.send({ response: cachedResponse });
  }

  let symbol = "RELIANCE.NS"; // Default
  if (problem.includes("investment insight for")) {
    const match = problem.match(/investment insight for (\S+)/);
    symbol = match ? match[1] : symbol;
  }

  const stockData = await fetchIndianStockData(symbol);
  const stockInfo = stockData.error
    ? "<p>Stock data unavailable.</p>"
    : `
      <div class="stock-example">
        <h3>Stock Snapshot (${stockData.symbol})</h3>
        <p><strong>Current Price:</strong> ₹${stockData.price}</p>
        <p><strong>Change:</strong> ₹${stockData.change} (${stockData.changePercent}%)</p>
      </div>
    `;

  const prompt = `
    You are FinAI Bharat, a GenAI financial assistant for Indian investors with low financial literacy. 
    The user's name is ${name}, their goal is ${goal}, risk tolerance is ${risk}, and investment horizon is ${horizon}. 
    They asked: '${problem}'. 
    If the query involves a stock (e.g., ${symbol}), include this data: Current Price: ₹${stockData.price}, Change: ₹${stockData.change} (${stockData.changePercent}%). 
    Provide a detailed, beginner-friendly response in ${language}. 
    Explain concepts simply, address their question, and recommend specific India-centric investment products (e.g., SBI Bluechip Fund, ${symbol} stock, PPF, SIPs, Gold Bonds) that suit their profile. 
    Include a short financial literacy tip relevant to their query. 
    Format your response as HTML with <h3> for section headings, <ul> or <ol> for lists, and <strong> for emphasis. 
    End with a disclaimer: "This is educational content, not financial advice. Consult a financial advisor."
    Do not wrap the response in any code block markers; return only the raw HTML content.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();

    // Clean up unwanted Markdown code block markers
    responseText = responseText
      .replace(/```html/g, "") // Remove ```html markers
      .replace(/```/g, "") // Remove ``` markers
      .trim();

    const fullResponse = `
      ${responseText}
      ${stockInfo}
    `;
    cache.set(cacheKey, fullResponse);
    res.send({ response: fullResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      response: "Sorry, something went wrong. Please try again later!",
    });
  }
});

app.post("/simulatePortfolio", async (req, res) => {
  const { amount, risk, horizon } = req.body;
  const prompt = `
    Simulate a simple investment portfolio for an Indian investor with ₹${amount}, ${risk} risk tolerance, and ${horizon} investment horizon. 
    Suggest a breakdown (e.g., 50% mutual funds, 30% stocks, 20% PPF) with India-specific options and projected growth over ${
      horizon === "short"
        ? "3 years"
        : horizon === "medium"
        ? "5 years"
        : "10 years"
    }. 
    Keep it simple and educational. 
    Format your response in HTML with <h3> headings and <ul> lists.
    Do not wrap the response in html or any other code block markers; return only the raw HTML content.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    res.send({ response: responseText });
  } catch (error) {
    res.status(500).send({ response: "Simulation failed. Try again!" });
  }
});

app.post("/getStockData", async (req, res) => {
  const { symbol } = req.body;
  const cacheKey = `stock-${symbol}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.send(cachedData);
  }

  try {
    const stockData = await fetchIndianStockData(symbol);
    cache.set(cacheKey, stockData);
    res.send(stockData);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch stock data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
