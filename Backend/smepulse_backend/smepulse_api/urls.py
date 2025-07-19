from django.urls import path, include
from .app_views.user_views import *
from .app_views.office_views import *
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# Register your OfficeViewSet. This will handle both /offices/ and /offices/<pk_or_name>/
router.register(r'office-details', OfficeViewSet, basename='office')
# If you also want to use ApplicationViewSet with a router:
# router.register(r'applications', ApplicationViewSet, basename='application')


urlpatterns = [
     path('', include(router.urls)),
    path('offices/', OfficeListAPIView.as_view(), name='office-list'),
    path('all-officers/', OfficerListView.as_view(), name='officer-list'),
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path('pending-approvals/', PendingApprovalListAPIView.as_view(), name='pending-approvals'),
    path('approve-user/<int:id>/', ApproveUserAPIView.as_view(), name='approve-user'),
    path('reject-user/<int:id>/', RejectUserAPIView.as_view(), name='reject-user'),
    path('token/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-profile/', CurrentUserView.as_view(), name='current_user'),
    
    #  path('offices/<str:pk>/', OfficeDetailView.as_view(), name='office-detail'),
    path('applications/', ApplicationListView.as_view(), name='application-list'),

]