from httpcore import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions
from rest_framework.views import APIView
from django_backend_starter.core.repositories.audit_repository import AuditRepository
from django_backend_starter.core.repositories.user_repository_impl import UserRepositoryImpl as UserRepository

class AuditedJWTLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        ip = request.META.get("REMOTE_ADDR")
        ua = request.META.get("HTTP_USER_AGENT")

        user, error = UserRepository().authenticate_user(email, password)
        audit = AuditRepository()

        if error:
            if user and error.startswith("Account locked"):
                audit.log_event(user=user, email=email, event_type="LOCKOUT", ip=ip, ua=ua)
            else:
                audit.log_event(email=email, event_type="FAILURE", ip=ip, ua=ua)
            return Response({"error": error}, status=status.HTTP_401_UNAUTHORIZED)

        audit.log_event(user=user, email=email, event_type="SUCCESS", ip=ip, ua=ua)
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)}, status=200)
