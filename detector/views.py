import joblib
from django.shortcuts import render
from django.http import JsonResponse
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import os

# Load the model (make sure the path to your model is correct)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "fake_news_model.pkl")

model = joblib.load(MODEL_PATH)

def predict_fake_news(news_text):
    """Predict whether the given text is fake or real"""
    prediction = model.predict([news_text])  
    return prediction[0]

def home(request):
    """Home page view"""
    return render(request, 'detector/home.html')

def predict(request):
    """Predict view"""
    if request.method == "POST":
        news_text = request.POST.get('news_text')
        if news_text:
            prediction = predict_fake_news(news_text)
            result = "FAKE" if prediction == 0 else "REAL"
            return JsonResponse({'prediction': result})
        else:
            return JsonResponse({'error': 'No text provided'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

