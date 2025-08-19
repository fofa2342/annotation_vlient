from django.shortcuts import render
from django.contrib import messages

def historique(request):
    return render(request, "history.html")

def resultats(request):
    return render(request, "results.html")

def index(request):
    return render(request, "index.html")

def upload(request):
    return render(request, "upload.html")