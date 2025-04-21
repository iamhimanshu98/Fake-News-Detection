import joblib
from django.shortcuts import render
from django.http import JsonResponse
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "model_logistic.pkl")

model = joblib.load(MODEL_PATH)

def predict_fake_news(news_text):
    prediction = model.predict([news_text])
    return prediction[0]

def home(request):
    """Home page view with sample news"""
    sample_news = [
        {"text": "PM Modi Addresses Nation on Economic Reforms."},  # real
        {"text": "Government Announces New Education Policy."},  # real
        {"text": "NASA Announces Discovery of Ancient City on Mars."},  # fake
        {"text": "WhatsApp Message Claims Aadhaar Not Needed for Bank Accounts."},  # fake
        {"text": "India Successfully Launches Communication Satellite."},  # real
        {"text": "₹10 Coins Are No Longer Legal Tender."},  # fake
        {"text": "IIT Bombay Develops Low-Cost COVID-19 Testing Kit."},  # real
        {"text": "Supreme Court Adjourns Hearing on Ayodhya Land Dispute."},  # real
        {"text": "Kerala Launches Statewide Organic Farming Drive."},  # real
        {"text": "Viral Video Shows Muslims Attacking Hindu Temple."},  # fake
        {"text": "Global Vaccination Campaign Targets Measles Outbreak."},  # real
        {"text": "UN Declares Earth Will Be Destroyed by Asteroid Next Week."},  # fake
        {"text": "Traditional Art Form of Madhubani Gains Global Recognition."}  # real
    ]

    return render(request, 'detector/home.html', {'sample_news': sample_news})

def predict(request):
    """Prediction API endpoint"""
    if request.method == "POST":
        news_text = request.POST.get('news_text')
        if news_text:
            prediction = predict_fake_news(news_text)
            result = "FAKE" if prediction == 1 else "REAL"
            return JsonResponse({'prediction': result})
        else:
            return JsonResponse({'error': 'No text provided'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
