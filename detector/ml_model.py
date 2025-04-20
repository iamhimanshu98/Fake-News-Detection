import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "fake_news_model.pkl")

model = joblib.load(MODEL_PATH)

def predict_fake_news(news_text):
    """Predict whether the given text is fake or real"""
    prediction = model.predict([news_text])  
    return prediction[0]
