# from rest_framework import serializers
# from django.contrib.auth import get_user_model
# from .models import (
#     Application,
#     DocumentUpload,
#     VerificationStatus,
#     ChatLog,
#     ApplicationLog,
#     PhoneVerification,
#     GovernmentUser,
# )

# User = get_user_model()

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = [
#             'id', 'username', 'email', 'user_type', 'phone_number', 'avatar',
#         ]
#         read_only_fields = ['id', 'username', 'email']

# class GovernmentUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GovernmentUser
#         fields = [
#             'id', 'email', 'full_name', 'government_id', 'phone', 'office', 'department', 'position', 'is_approved', 'created_at'
#         ]
#         read_only_fields = ['id', 'created_at']

# class DocumentUploadSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = DocumentUpload
#         fields = [
#             'id', 'application', 'document_type', 'file', 'uploaded_at', 'verified'
#         ]
#         read_only_fields = ['id', 'uploaded_at', 'verified']

# class VerificationStatusSerializer(serializers.ModelSerializer):
#     verified_by = UserSerializer(read_only=True)
#     class Meta:
#         model = VerificationStatus
#         fields = [
#             'id', 'application', 'verifier', 'verified_by', 'is_verified', 'comment', 'verified_at'
#         ]
#         read_only_fields = ['id', 'verified_by', 'verified_at']

# class ApplicationLogSerializer(serializers.ModelSerializer):
#     performed_by = UserSerializer(read_only=True)
#     class Meta:
#         model = ApplicationLog
#         fields = [
#             'id', 'application', 'action', 'performed_by', 'timestamp'
#         ]
#         read_only_fields = ['id', 'timestamp', 'performed_by']

# class ChatLogSerializer(serializers.ModelSerializer):
#     user = UserSerializer(read_only=True)
#     class Meta:
#         model = ChatLog
#         fields = [
#             'id', 'user', 'message', 'response', 'timestamp'
#         ]
#         read_only_fields = ['id', 'timestamp', 'user']

# class PhoneVerificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PhoneVerification
#         fields = [
#             'id', 'user', 'email', 'phone_number', 'verification_code', 'created_at', 'expires_at', 'is_verified'
#         ]
#         read_only_fields = ['id', 'created_at', 'expires_at', 'is_verified']

# class ApplicationSerializer(serializers.ModelSerializer):
#     trader = UserSerializer(read_only=True)
#     documents = DocumentUploadSerializer(many=True, read_only=True)
#     verifications = VerificationStatusSerializer(many=True, read_only=True)
#     logs = ApplicationLogSerializer(many=True, read_only=True)

#     class Meta:
#         model = Application
#         fields = [
#             'id', 'trader', 'created_at', 'updated_at', 'business_name', 'location', 'business_type', 'status',
#             'documents', 'verifications', 'logs',
#         ]
#         read_only_fields = ['id', 'created_at', 'updated_at', 'trader', 'documents', 'verifications', 'logs'] 