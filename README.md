# 📈 Stock Portfolio Tracker API

## 🚀 Overview

A Spring Boot backend API for tracking stock and ETF portfolios.  
It supports CRUD operations for holdings, calculates portfolio performance, ETF exposure, and uses live market data from Finnhub with caching.

---

## 🧠 Features

- Add, update, delete holdings
- View all holdings
- Live stock prices (Finnhub API)
- 60-second in-memory caching
- Portfolio summary (value, cost, profit)
- Per-holding performance
- Daily gain/loss (based on previous close)
- ETF exposure (VOO, VGT supported)
- Validation and structured error handling

---

## 🏗️ Architecture
controller/ → API endpoints
service/ → Business logic
repository/ → Database access
model/ → Entities
dto/ → API request/response objects
exception/ → Error handling

## 🔗 API Endpoints

### 📦 Holdings

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/api/holdings` | Get all holdings |
| GET | `/api/holdings/{id}` | Get holding by ID |
| POST | `/api/holdings` | Add new holding |
| PUT | `/api/holdings/{id}` | Update holding |
| DELETE | `/api/holdings/{id}` | Delete holding |
| GET | `/api/holdings/performance` | Get performance per holding |

---

### 📊 Portfolio

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/api/portfolio/summary` | Portfolio totals |
| GET | `/api/portfolio/exposure` | ETF/company exposure |
| GET | `/api/portfolio/performance` | Overall performance |

---

### 💹 Stocks

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/api/stocks/{symbol}/quote` | Get stock quote |

---

## 📥 Example Requests

### Add Holding

```json
POST /api/holdings
{
  "symbol": "VOO",
  "assetType": "ETF",
  "quantity": 2,
  "averageBuyPrice": 450
}

{
  "symbol": "AAPL",
  "price": 190.25,
  "open": 188.4,
  "high": 191.2,
  "low": 187.9,
  "previousClose": 189.1,
  "change": 1.15,
  "changePercent": 0.61
}
In-memory cache using ConcurrentHashMap
Cache duration: 60 seconds
Reduces API calls and improves performance

🚀 Frontend Plan

Build UI in this order:

Dashboard
Holdings table
Add holding form
Portfolio summary cards
Performance cards
ETF exposure section
Dark/light mode
Animations
Recommended stack:
React + Vite
Tailwind CSS
Axios
Framer Motion


Next Improvements
PostgreSQL instead of H2
Redis caching
Real ETF holdings API
Authentication (users)
Portfolio history tracking
Charts (Recharts)
