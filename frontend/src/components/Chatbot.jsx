import { useState, useEffect, useRef } from "react";
import Footer from "./Footer";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Namaste! I’m FinAI Bharat. How can I help you with your investments today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [recommendations, setRecommendations] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [stockUpdates, setStockUpdates] = useState([]);
  const chatContainerRef = useRef(null);
  const speechRef = useRef(null);

  // Load voices
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch live stock updates for 3 popular stocks
  useEffect(() => {
    const popularStocks = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"];

    const fetchStockUpdates = async () => {
      try {
        const stockDataPromises = popularStocks.map(async (symbol) => {
          const response = await fetch("http://localhost:3000/getStockData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol }),
          });
          return response.json();
        });

        const stockData = await Promise.all(stockDataPromises);
        setStockUpdates(
          stockData.map((data) =>
            data.error
              ? { symbol: data.symbol || "Unknown", error: data.error }
              : data
          )
        );
      } catch (error) {
        setStockUpdates(
          popularStocks.map((symbol) => ({
            symbol,
            error: "Failed to fetch data",
          }))
        );
      }
    };

    fetchStockUpdates();
    const interval = setInterval(fetchStockUpdates, 60000);
    return () => clearInterval(interval);
  }, []);

  const getResponse = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInput("");

    try {
      const response = await fetch("http://localhost:3000/getResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "User",
          goal: "General Investment",
          risk: "medium",
          horizon: "medium",
          problem: input,
          language,
        }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { text: data.response, sender: "ai", timestamp: new Date() },
      ]);
      setIsTyping(false);
      const recs = extractRecommendations(data.response);
      setRecommendations(
        recs.length
          ? recs
          : ["No specific products recommended yet. Ask more questions!"]
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong!",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }
  };

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang =
      language === "Hindi"
        ? "hi-IN"
        : language === "Tamil"
        ? "ta-IN"
        : language === "Bengali"
        ? "bn-IN"
        : language === "Marathi"
        ? "mr-IN"
        : "en-IN";
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      getResponse();
    };
    recognition.onerror = (event) =>
      setMessages((prev) => [
        ...prev,
        {
          text: `Voice input failed: ${event.error}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    recognition.start();
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechRef.current = null;
    } else {
      if (voices.length === 0) {
        setMessages((prev) => [
          ...prev,
          { text: "No voices available.", sender: "ai", timestamp: new Date() },
        ]);
        return;
      }
      window.speechSynthesis.cancel();
      const lastResponse =
        messages.filter((msg) => msg.sender === "ai").pop()?.text ||
        "No response yet.";
      const cleanText = stripHtml(lastResponse);
      const speech = new SpeechSynthesisUtterance(cleanText);
      speech.lang =
        language === "Hindi"
          ? "hi-IN"
          : language === "Tamil"
          ? "ta-IN"
          : language === "Bengali"
          ? "bn-IN"
          : language === "Marathi"
          ? "mr-IN"
          : "en-IN";
      const voice = voices.find((v) => v.lang === speech.lang);
      if (voice) speech.voice = voice;
      else {
        setMessages((prev) => [
          ...prev,
          {
            text: `No ${language} voice available.`,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      speech.onend = () => setIsSpeaking(false);
      speech.onerror = (event) =>
        event.error !== "interrupted" &&
        setMessages((prev) => [
          ...prev,
          {
            text: `Speech failed: ${event.error}`,
            sender: "ai",
            timestamp: new Date(),
          },
        ]);
      window.speechSynthesis.speak(speech);
      setIsSpeaking(true);
      speechRef.current = speech;
    }
  };

  const extractRecommendations = (response) => {
    const products = [
      "SBI Bluechip Fund",
      "RELIANCE.NS",
      "PPF",
      "SIP",
      "Gold Bonds",
      "HDFC Small Cap Fund",
      "TCS.NS",
    ];
    return products.filter((product) => response.includes(product));
  };

  const saveChat = () => {
    const chatText = messages
      .map(
        (msg) =>
          `${msg.sender.toUpperCase()} (${msg.timestamp.toLocaleTimeString()}): ${stripHtml(
            msg.text
          )}`
      )
      .join("\n");
    const blob = new Blob([chatText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FinAI_Chat_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
  };

  const quickQuestions = [
    "What is a mutual fund?",
    "How should I invest ₹50,000?",
    "What are SIPs?",
    "Is PPF a good option?",
  ];

  return (
    <div className="chatbot-page">
      <div className="chatbot-hero">
        <h1>FinAI Bharat: Your Investment Companion</h1>
        <p>Talk to me about stocks, funds, and more – in your language!</p>
      </div>
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h2>Chat with FinAI Bharat</h2>
          <div className="header-controls">
            <button className="save-chat-btn" onClick={saveChat}>
              💾 Save Chat
            </button>
          </div>
        </div>
        <div className="chat-main">
          <section className="chat-section">
            <div className="chat-container" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.sender}-message`}
                >
                  <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message ai-message typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
            </div>
            <div className="quick-questions">
              <h3>Quick Questions</h3>
              <div className="quick-buttons">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(q);
                      getResponse();
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="input-section">
              <textarea
                className="problem-input"
                rows="4"
                placeholder="Type your investment question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), getResponse())
                }
              />
              <div className="input-controls-box">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                </select>
                <button onClick={startVoiceInput}>🎤 Voice</button>
                <button onClick={getResponse}>Send</button>
                <button onClick={toggleSpeech}>
                  {isSpeaking ? "⏹️ Stop" : "🔊 Listen"}
                </button>
              </div>
            </div>
          </section>
          <section className="sidebar">
            <div className="recommendations-section">
              <h3>Recommended Products</h3>
              <div className="recommendations">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <p>{rec}</p>
                    <button
                      onClick={() => setInput(`Tell me more about ${rec}`)}
                    >
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="stock-ticker">
              <h3>Live Stock Updates</h3>
              {stockUpdates.length === 0 ? (
                <p>Loading stock data...</p>
              ) : (
                stockUpdates.map((stock, index) => (
                  <p key={index}>
                    {stock.error ? (
                      `${stock.symbol}: Data unavailable`
                    ) : (
                      <>
                        <span className="stock-symbol">{stock.symbol}</span>:{" "}
                        <span className="stock-price">₹{stock.price}</span>{" "}
                        <span
                          className={`stock-change ${
                            stock.change < 0 ? "negative" : ""
                          }`}
                        >
                          ({stock.change >= 0 ? "+" : ""}
                          {stock.changePercent}%)
                        </span>
                      </>
                    )}
                  </p>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Chatbot;
