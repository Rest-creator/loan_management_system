from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Office, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password'),
        }

        user = authenticate(**credentials)

        if not user:
            raise serializers.ValidationError('No active account found with the given credentials')

        data = super().validate(attrs)
        return data

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password', 'confirm_password',
            'phone', 'office', 'reason'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data['phone'],
            office=validated_data['office'],
            reason=validated_data['reason'],
            is_active=False
        )
        return user
    

# This is the UserSerializer for LISTING users
class UserSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField for full_name as it's a calculated property
    full_name = serializers.SerializerMethodField()
    # If 'office' is a ForeignKey to an 'Office' model, you can serialize its name directly
    # or nest the entire Office object if your frontend expects it.
    # Frontend expects 'office: string', so getting the name is best.
    office = serializers.CharField(source='office.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'full_name',
            'phone', 'office', 'reason', 'date_joined', 'status'
        ]
        # read_only_fields = ['id', 'email', 'full_name', 'date_joined', 'status']
    
    def get_full_name(self, obj):
        # Access the first_name and last_name from the User instance
        return f"{obj.first_name} {obj.last_name}"
