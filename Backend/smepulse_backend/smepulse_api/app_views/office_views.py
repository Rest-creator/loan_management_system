
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model

from ..app_serializers.user_serializer import UserSerializer

from ..models import Application, Office
from ..app_serializers.officer_serializer import ApplicationSerializer, OfficerListSerializer, OfficeSerializer # Import the new serializer

User = get_user_model()

# View to list all officers
class OfficerListView(generics.ListAPIView):
    queryset = User.objects.filter(is_active=True).exclude(is_superuser=True) 
    serializer_class = OfficerListSerializer
    permission_classes = [IsAuthenticated] # Only admins can view all officers

    def get_queryset(self):
        # Filter for active users who are not superusers
        queryset = super().get_queryset()
            
        return queryset

# View to list all offices (if needed, otherwise offices are hardcoded in frontend)
class OfficeListView(generics.ListAPIView):
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAuthenticated, IsAdminUser] 
    


# --- ViewSets (recommended for standard CRUD) ---
class OfficeViewSet(viewsets.ReadOnlyModelViewSet): # Use ReadOnlyModelViewSet if only fetching
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAuthenticated] # Adjust permissions as needed
    lookup_field = 'name' # If your primary key is 'id' and not the default 'pk'

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        office_id = self.request.query_params.get('office_id', None)
        if office_id is not None:
            queryset = queryset.filter(office__id=office_id) # Assuming Application has a ForeignKey to Office
        return queryset

# Assuming Officers are just a subset of Users or a different model
class AllOfficersListView(generics.ListAPIView):
    queryset = User.objects.filter(role='officer') # Adjust filter based on how you identify officers
    serializer_class = UserSerializer # Or a specific OfficerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        office_id = self.request.query_params.get('office_id', None)
        if office_id is not None:
            # Assuming 'User' has an 'office' field that is a CharField matching Office.id
            queryset = queryset.filter(office=office_id)
        return queryset


class OfficeDetailView(generics.RetrieveAPIView): # This is your detail view
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'name' # If your primary key is 'id'

class OfficeListAPIView(generics.ListAPIView): # If you also have a separate list view
   queryset = Office.objects.all()
   serializer_class = OfficeSerializer
   permission_classes = [IsAuthenticated]


class ApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated] # Ensure only authenticated users can access

    def get_queryset(self):
        """
        Optionally filters applications by office_id, status, or user.
        """
        queryset = Application.objects.all()

        # Filter by office_id from query parameters (e.g., /api/applications/?office_id=zimra)
        office_id = self.request.query_params.get('office_id', None)
        if office_id is not None:
            queryset = queryset.filter(office__id=office_id) # Use office__id for ForeignKey lookup

        # Filter by status (e.g., /api/applications/?status=pending)
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status)

        return queryset.order_by('-created_at') # Always order your results


