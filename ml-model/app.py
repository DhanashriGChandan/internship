from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="PhishGuard ML API")

model = joblib.load("phishing_model.pkl")


class URLRequest(BaseModel):
    URLLength: int
    IsHTTPS: int
    NoOfSubDomain: int
    NoOfOtherSpecialCharsInURL: int
    HasObfuscation: int
    NoOfObfuscatedChar: int
    NoOfQMarkInURL: int
    NoOfAmpersandInURL: int
    NoOfEqualsInURL: int


@app.get("/")
def home():
    return {
        "message": "PhishGuard ML API is running"
    }


@app.post("/predict")
def predict(data: URLRequest):

    features = pd.DataFrame([{
        "URLLength": data.URLLength,
        "IsHTTPS": data.IsHTTPS,
        "NoOfSubDomain": data.NoOfSubDomain,
        "NoOfOtherSpecialCharsInURL": data.NoOfOtherSpecialCharsInURL,
        "HasObfuscation": data.HasObfuscation,
        "NoOfObfuscatedChar": data.NoOfObfuscatedChar,
        "NoOfQMarkInURL": data.NoOfQMarkInURL,
        "NoOfAmpersandInURL": data.NoOfAmpersandInURL,
        "NoOfEqualsInURL": data.NoOfEqualsInURL
    }])

    prediction = model.predict(features)[0]

    probability = model.predict_proba(features)[0]

    return {
        "prediction": int(prediction),
        "label": "Phishing" if prediction == 1 else "Legitimate",
        "confidence": float(max(probability))
    }
