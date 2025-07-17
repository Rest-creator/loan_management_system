from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

# from ..serializers import UserSerializer
from ..models import Office, User
from ..app_serializers.user_serializer import (
    UserRegistrationSerializer, 
    OfficeSerializer,
    UserSerializer,
    # UserSerializer
)
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

User = get_user_model()

class OfficeListAPIView(generics.ListAPIView):
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [AllowAny]

class UserRegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"detail": "Account request submitted successfully. You'll be notified once approved."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )





class PendingApprovalListAPIView(ListAPIView):
    # Only authenticated users can see this
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = User.objects.filter(status='pending') # Assuming 'status' field exists
    serializer_class = UserSerializer # Your User serializer that exposes relevant fields

class ApproveUserAPIView(APIView):
    # Only authenticated users who are also staff/admin can approve
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.status = 'approved'
        user.is_active = True # Activate the user!
        user.save()
        return Response({"message": "User approved successfully and activated.", "user_id": user.id}, status=status.HTTP_200_OK)

class RejectUserAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, id):
        user = get_object_or_404(User, id=id)
        user.status = 'rejected'
        user.is_active = False # Keep rejected users inactive
        user.save()
        return Response({"message": "User request rejected.", "user_id": user.id}, status=status.HTTP_200_OK)

from rest_framework_simplejwt.views import TokenObtainPairView
from ..app_serializers.user_serializer import EmailTokenObtainPairSerializer

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

