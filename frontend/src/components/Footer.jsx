import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
        <img
            src="/assets/logo.jpg"
            alt="FinAI Bharat Logo"
            className="footer-logo"
          />
      <div className="footer-container">
        {/* Company Info with Logo */}
        <div className="footer-section company-info">
          
          <h3>FinAI Bharat</h3>
          <p>
            Empowering Indian investors with AI-driven financial guidance. Your
            trusted partner in wealth creation.
          </p>
          <p>© {new Date().getFullYear()} FinAI Bharat. All rights reserved.</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-section nav-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chatbot">Chatbot</Link>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-info">
          <h3>Contact Us</h3>
          <p>Email: support@finaibharat.com</p>
          <p>Phone: +91 123-456-7890</p>
          <p>Address: 123 Finance Street, Mumbai, India</p>
        </div>

        {/* Subscription Form */}
        <div className="footer-section subscribe">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest insights.</p>
          <form className="subscribe-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="subscribe-input"
            />
            <button type="submit" className="subscribe-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media */}
      <div className="footer-social">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
