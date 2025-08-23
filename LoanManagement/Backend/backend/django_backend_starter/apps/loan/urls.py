from django.urls import path

from .views.admin_view import *

from .views.audit_view import AuditedJWTLoginView
from .views.auth_view import LoginView
from .views.auth_view import SessionLoginView, SessionLogoutView, SessionMeView
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView, TokenBlacklistView
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/jwt/audited-create/", AuditedJWTLoginView.as_view(), name="jwt-audited-create"),
    path('agents/add/', AddAgentView.as_view(), name="add-agent"),
    path("all/agents/", ListAgentsView.as_view(), name="list-agents"),


    
        # Session-based
    path("auth/session/login/", SessionLoginView.as_view(), name="session-login"),
    path("auth/session/logout/", SessionLogoutView.as_view(), name="session-logout"),
    path("auth/session/me/", SessionMeView.as_view(), name="session-me"),

    # JWT-based
    path("auth/jwt/create/", TokenObtainPairView.as_view(), name="jwt-create"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
    path("auth/jwt/blacklist/", TokenBlacklistView.as_view(), name="jwt-blacklist"),
]

