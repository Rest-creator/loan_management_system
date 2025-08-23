from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django_backend_starter.core.services.user_services import UserService

from django_backend_starter.apps.loan.models import UserModel
from django_backend_starter.core.permissions.role_permissions import IsAdmin, IsAgent
from core.repositories.user_repository_impl import UserRepositoryImpl

user_repo = UserRepositoryImpl()
user_service = UserService(repo=user_repo)

class AddAgentView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        data = request.data
        try:
            # user_service = UserService()
            agent = user_service.add_agent(
                email=data.get("email"),
                first_name=data.get("first_name"),
                last_name=data.get("last_name"),
                contact_number=data.get("phone_number"),
                branch=data.get("branch"),
                region=data.get("region")
            )
            return Response({
                "message": "Agent created successfully",
                "agent": agent.__dict__
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class ListAgentsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        repo = UserRepositoryImpl()
        users = repo.get_all_agents()  # we’ll implement this
        return Response([u.__dict__ for u in users], status=status.HTTP_200_OK)



class SuspendUserView(APIView):
    permission_classes = [IsAdmin ]
    
    def post(self, request, user_id):
        reason = request.data.get("reason", "")
        admin = request.user  # current logged-in admin

        # user_service = UserService()
        user = UserModel.objects.get(id=user_id)
        user_service.suspend_user(admin, user, reason)

        return Response({"message": "User suspended"}, status=status.HTTP_200_OK)

class ReactivateUserView(APIView):
    
    permission_classes = [IsAdmin ]  # Allow both admin and agent to reactivate users  
    def post(self, request, user_id):
        admin = request.user
        # user_service = UserService()
        user = UserModel.objects.get(id=user_id)
        user_service.reactivate_user(admin, user)

        return Response({"message": "User reactivated"}, status=status.HTTP_200_OK)
