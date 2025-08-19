from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth import login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from .forms import CustomUserCreationForm

def login_user(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.info(request, f"Bienvenue, {user.username}!")
            return redirect('index')
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe invalide.")
    else:
        form = AuthenticationForm()
    return render(request, "login.html", {"form": form})

def logout_user(request):
    logout(request)
    messages.info(request, "Vous avez été déconnecté avec succès.")
    return redirect('account:login')

def register_user(request):
    if request.user.is_authenticated:
        return redirect('index')
        
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"Bienvenue, {user.first_name}! Votre compte a été créé.")
            return redirect("index")
        else:
            # Pass form with errors directly to template
            return render(request, "register.html", {"form": form})
    else:
        form = CustomUserCreationForm()
    return render(request, "register.html", {"form": form})