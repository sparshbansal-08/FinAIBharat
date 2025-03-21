import { useState, useEffect, useRef } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you with your investments today?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [recommendations, setRecommendations] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getResponse = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [
      ...prev,
      userMessage,
      { text: "Thinking...", sender: "ai", id: "loading" },
    ]);
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

      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== "loading")
          .concat({ text: data.response, sender: "ai" })
      );
      const recs = extractRecommendations(data.response);
      setRecommendations(
        recs.length
          ? recs
          : ["No specific products recommended yet. Ask more questions!"]
      );
    } catch (error) {
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== "loading")
          .concat({
            text: "Sorry, something went wrong. Please try again!",
            sender: "ai",
          })
      );
    }
  };

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang =
      language === "Hindi" ? "hi-IN" : language === "Tamil" ? "ta-IN" : "en-IN";
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      getResponse();
    };
    recognition.start();
  };

  const readResponse = () => {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const lastResponse =
      messages.filter((msg) => msg.sender === "ai").pop()?.text ||
      "No response yet.";
    const speech = new SpeechSynthesisUtterance(lastResponse);
    speech.lang =
      language === "Hindi" ? "hi-IN" : language === "Tamil" ? "ta-IN" : "en-IN";
    window.speechSynthesis.speak(speech);
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

  return (
    <div className={`chatbot-container ${isLightTheme ? "light" : ""}`}>
      <div className="chatbot-header">
        <h1>FinAI Bharat Chatbot</h1>
        <button
          className="theme-toggle"
          onClick={() => setIsLightTheme(!isLightTheme)}
        >
          {isLightTheme ? "🌞" : "🌙"}
        </button>
      </div>
      <div className="chat-main">
        <section className="chat-section">
          <div className="chat-header">
            <h2>Ask Your Financial Questions</h2>
            <p>Get personalized advice and product recommendations.</p>
          </div>
          <div className="chat-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}-message`}>
                <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
              </div>
            ))}
          </div>
          <div className="input-section">
            <textarea
              className="problem-input"
              rows="3"
              placeholder="Ask anything (e.g., What is a mutual fund? How should I invest ₹50,000?)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), getResponse())
              }
            />
            <div className="input-controls">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
              <button onClick={startVoiceInput}>🎤 Voice</button>
              <button onClick={getResponse}>Send</button>
              <button onClick={readResponse}>🔊 Listen</button>
            </div>
          </div>
        </section>
        <section className="recommendations-section">
          <h2>Recommended Products</h2>
          <div className="recommendations">
            {recommendations.map((rec, index) => (
              <p key={index}>{rec}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Chatbot;
