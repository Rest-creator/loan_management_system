from django.urls import path
from .app_views.user_views import (
    OfficeListAPIView,
    UserRegistrationAPIView,
    PendingApprovalListAPIView,
    ApproveUserAPIView,
    RejectUserAPIView,
    EmailTokenObtainPairView
)
from django.contrib import admin
from django.urls import  include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('offices/', OfficeListAPIView.as_view(), name='office-list'),
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path('pending-approvals/', PendingApprovalListAPIView.as_view(), name='pending-approvals'),
    path('approve-user/<int:id>/', ApproveUserAPIView.as_view(), name='approve-user'),
    path('reject-user/<int:id>/', RejectUserAPIView.as_view(), name='reject-user'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]