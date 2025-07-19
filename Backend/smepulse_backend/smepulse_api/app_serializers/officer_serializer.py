# your_app_name/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Application, User, Office 

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name']


class OfficerListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    office_id = serializers.CharField(source='office', read_only=True)
    office_name = serializers.CharField(source='get_office_display', read_only=True)
    role = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)


    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'office_id', 'office_name', 'role', 'status', 'status_display'
        ]
        # Make all fields read-only for this list view
        read_only_fields = fields 
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_role(self, obj):
        # Your role logic, same as in your CurrentUserSerializer
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff: # Assuming is_staff indicates an officer
            return 'officer'
      
        return 'officer' 
    
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'


