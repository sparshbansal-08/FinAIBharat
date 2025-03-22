import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [heroText, setHeroText] = useState("");
  const [queryText, setQueryText] = useState("");
  const fullHeroText = "AI FOR INDIA'S FINANCE FUTURE";

  useEffect(() => {
    const queries = [
      "How do I start a SIP?",
      "What’s the best mutual fund?",
      "How to invest in stocks?",
      "Is PPF a good option?",
    ];

    let heroIndex = 0;
    const typeHeroText = () => {
      if (heroIndex < fullHeroText.length) {
        setHeroText(fullHeroText.substring(0, heroIndex + 1));
        heroIndex++;
        setTimeout(typeHeroText, 100);
      }
    };
    typeHeroText();

    let queryIndex = 0;
    let charIndex = 0;
    const typeQuery = () => {
      const currentQuery = queries[queryIndex];
      if (charIndex < currentQuery.length) {
        setQueryText(currentQuery.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeQuery, 100);
      } else {
        setTimeout(() => {
          charIndex = 0;
          queryIndex = (queryIndex + 1) % queries.length;
          setQueryText("");
          typeQuery();
        }, 2000);
      }
    };
    typeQuery();
  }, []);

  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          {heroText.slice(0, -1)}
          <span className="last-letter">{heroText.slice(-1)}</span>
        </h1>
        <p>
          Empowering millions of Indian investors with personalized, AI-driven
          financial guidance. From SIPs to stocks, we make investing simple,
          smart, and accessible.
        </p>
        <Link to="/chatbot" className="get-started-btn">
          Get Started 🤖
        </Link>
        <p>
          ➡️Scroll down to learn more about Stocks ⬅️
        </p>
      </div>
      <div className="hero-image">
        <img
          src="/assets/mobile-mockup.jpg"
          alt="Mobile Mockup"
          className="mobile-mockup"
        />
        <div className="mockup-inbox">
          <p className="mockup-query">
            {queryText.slice(0, -1)}
            <span className="last-letter">{queryText.slice(-1)}</span>
          </p>
          <div className="mockup-controls">
            <span className="voice-icon">🎙️</span>
            <span className="send-icon">➤</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;