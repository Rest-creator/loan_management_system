# apps/loan/middleware/password_expiry.py

from django.shortcuts import redirect
from django.urls import reverse

class PasswordExpiryMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            if request.user.is_password_expired() and request.path != reverse('change-password'):
                return redirect('change-password')
        return self.get_response(request)
