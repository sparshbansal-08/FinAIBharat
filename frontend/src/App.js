import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StockInsights from "./components/StockInsights";
import Chatbot from "./components/Chatbot";
import Footer from "./components/Footer"; // Ensure this is correct

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <StockInsights />
                <Footer />
              </>
            }
          />
          <Route
            path="/chatbot"
            element={
              <>
                <Chatbot />
                
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;