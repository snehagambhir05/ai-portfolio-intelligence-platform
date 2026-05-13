from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import yfinance as yf
import pandas as pd
import numpy as np
from app.ml.lstm_model import train_lstm

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

    stock = yf.Ticker(ticker)

    hist = stock.history(period="6mo")

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
            # LSTM Forecast
    lstm_predictions = train_lstm(
        hist["Close"].fillna(0).tolist()
    )

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