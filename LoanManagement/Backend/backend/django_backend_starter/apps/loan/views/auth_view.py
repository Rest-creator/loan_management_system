from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import login, logout, get_user_model
from django_backend_starter.core.services.auth_services import AuthService

from django_backend_starter.core.services.user_services import UserService

from django_backend_starter.core.repositories.user_repository_impl import UserRepositoryImpl
from django_backend_starter.core.services.auth_services import AuthService


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        service = AuthService(UserRepositoryImpl())
        try:
            data = service.login(email, password)
            return Response(data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


# apps/loan/api/views/auth_views.py

class ChangePasswordView(APIView):
    def post(self, request):
        user = request.user
        new_password = request.data.get("new_password")
        user_service = UserService()

        try:
            user_service.reset_password_admin(user, new_password)
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



User = get_user_model()

@method_decorator(csrf_exempt, name="dispatch")  # for API clients without CSRF; remove in prod if using browser
class SessionLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        ip = request.META.get("REMOTE_ADDR")
        ua = request.META.get("HTTP_USER_AGENT")

        if not email or not password:
            return Response({"error": "Email and password are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            user = AuthService().login(email, password, ip=ip, ua=ua)  # logs SUCCESS/FAIL/LOCKOUT
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        # establish Django session
        login(request, user)
        data = {
            "message": "Session login successful",
            "user": {
                "id": str(user.id),
                "email": user.email,
                "employee_id": user.employee_id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
            }
        }
        return Response(data, status=status.HTTP_200_OK)

class SessionLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)

class SessionMeView(APIView):
    def get(self, request):
        u = request.user
        return Response({
            "id": str(u.id),
            "email": u.email,
            "employee_id": u.employee_id,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "role": u.role,
        })

