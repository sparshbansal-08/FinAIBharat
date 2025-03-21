# GenAI Financial Assistant

## Overview

A dynamic, AI-powered financial assistant for Indian investors, featuring a sleek landing page and robust chatbot interface. It empowers users with personalized advice, portfolio simulation, and multilingual support.

## Features

- **Landing Page**: Modern navbar, animated "AI FOR INDIA'S FINANCE FUTURE" text, mobile mockup with rotating queries, and "Get Started" button.
- **Chatbot UI**: Dark/light theme, AI Q&A, portfolio simulator with chart, voice input/output.
- **India-Specific**: Suggests NSE/BSE stocks, mutual funds, PPF, etc.
- **Scalable**: Backend caching with NodeCache.

## Setup

1. **Install Dependencies**: `npm install express body-parser cors @google/generative-ai node-cache node-fetch`
2. **Add API Key**: Replace `YOUR_GOOGLE_API_KEY_HERE` in `server.js`.
3. **Run Server**: `node server.js`
4. **Open Landing Page**: Open `index.html` in a browser, then click "Get Started" for `chatbot.html`.

## Tech Stack

- **Backend**: Node.js, Express, Google Generative AI
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Data**: Yahoo Finance for Indian stocks

## Notes

- Add `assets/logo.png` and `assets/mobile-mockup.png` (use placeholders if unavailable).
- Sign-in/signup buttons are non-functional for now.
