import numpy as np
from sklearn.preprocessing import MinMaxScaler

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM

def train_lstm(prices):

    data = np.array(prices).reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0, 1))

    scaled_data = scaler.fit_transform(data)

    X = []
    y = []

    sequence_length = 10

    for i in range(sequence_length, len(scaled_data)):

        X.append(scaled_data[i-sequence_length:i, 0])

        y.append(scaled_data[i, 0])

    X = np.array(X)
    y = np.array(y)

    X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    model = Sequential()

    model.add(LSTM(50, return_sequences=True,
                   input_shape=(X.shape[1], 1)))

    model.add(LSTM(50))

    model.add(Dense(1))

    model.compile(
        optimizer="adam",
        loss="mean_squared_error"
    )

    model.fit(X, y, epochs=5, batch_size=8, verbose=0)

    last_sequence = scaled_data[-sequence_length:]

    future_predictions = []

    current_sequence = last_sequence.reshape(1, sequence_length, 1)

    for _ in range(10):

        prediction = model.predict(current_sequence, verbose=0)

        future_predictions.append(prediction[0, 0])

        current_sequence = np.append(
            current_sequence[:, 1:, :],
            [[[prediction[0, 0]]]],
            axis=1
        )

    future_predictions = scaler.inverse_transform(
        np.array(future_predictions).reshape(-1, 1)
    )

    return future_predictions.flatten().tolist()