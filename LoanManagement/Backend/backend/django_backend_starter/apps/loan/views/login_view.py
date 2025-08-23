from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ....core.services.auth_services import AuthService

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        ip = request.META.get("REMOTE_ADDR")
        ua = request.META.get("HTTP_USER_AGENT")

        try:
            auth_service = AuthService()
            user = auth_service.login(email, password, ip=ip, ua=ua)
            return Response({"message": "Login successful", "user": user.__dict__})
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
