from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import pandas as pd
import numpy as np

app = FastAPI(
    title="AI Portfolio Intelligence API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully"
    }

@app.get("/stock/{ticker}")
def get_stock(ticker: str):

    try:

    stock = yf.Ticker(ticker)

    hist = stock.history(period="1mo")

    if hist.empty:
        raise Exception("No stock data found")

except Exception as e:

    return {

        "ticker": ticker,

        "dates": [],

        "closing_prices": [],

        "avg_return": 0,

        "volatility": 0,

        "sharpe_ratio": 0,

        "simulations": [],

        "lstm_predictions": [],

        "error": str(e)

    }

    if hist.empty:
        return {
            "error": "Invalid stock ticker"
        }

    hist["Returns"] = hist["Close"].pct_change()

    avg_return = hist["Returns"].mean()

    volatility = hist["Returns"].std()

    sharpe_ratio = avg_return / volatility

    # Monte Carlo Simulation
    simulations = []

    last_price = hist["Close"].iloc[-1]

    for i in range(20):

        prices = [last_price]

        for j in range(30):

            next_price = prices[-1] * np.exp(
                (avg_return - (volatility ** 2) / 2)
                + volatility * np.random.normal()
            )

            prices.append(next_price)

        simulations.append(prices)

    # Mock AI Forecast
    lstm_predictions = [

        round(last_price * 1.01, 2),

        round(last_price * 1.02, 2),

        round(last_price * 1.03, 2),

        round(last_price * 1.04, 2),

        round(last_price * 1.05, 2)

    ]

    return {

        "ticker": ticker,

        "dates": hist.index.strftime("%Y-%m-%d").tolist(),

        "closing_prices": hist["Close"].fillna(0).tolist(),

        "avg_return": round(avg_return * 100, 4),

        "volatility": round(volatility * 100, 4),

        "sharpe_ratio": round(sharpe_ratio, 4),

        "simulations": simulations,

        "lstm_predictions": lstm_predictions

    }