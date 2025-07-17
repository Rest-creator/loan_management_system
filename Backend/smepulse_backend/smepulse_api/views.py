from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import (
    Application, DocumentUpload, VerificationStatus, ApplicationLog, ChatLog
)
from .serializers import (
    ApplicationSerializer, DocumentUploadSerializer, VerificationStatusSerializer, ApplicationLogSerializer, ChatLogSerializer
)
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

# --- Permissions ---
class IsTrader(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'user_type', None) == 'trader'

class IsOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'user_type', None) == 'officer'

# --- Trader Views ---
class TraderApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrader]

    def get_queryset(self):
        return Application.objects.filter(trader=self.request.user)

    def perform_create(self, serializer):
        serializer.save(trader=self.request.user)

class TraderDocumentUploadViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentUploadSerializer
    permission_classes = [permissions.IsAuthenticated, IsTrader]

    def get_queryset(self):
        return DocumentUpload.objects.filter(application__trader=self.request.user)

    def perform_create(self, serializer):
        # Only allow upload for own applications
        app = serializer.validated_data['application']
        if app.trader != self.request.user:
            raise PermissionDenied('Cannot upload documents for another user.')
        document = serializer.save()
        # --- Real-time notification to officers ---
        channel_layer = get_channel_layer()
        notification = {
            'type': 'send_notification',
            'data': {
                'message': f'New document uploaded for application {app.business_name}',
                'application_id': app.id,
                'document_id': document.id,
                'document_type': document.document_type,
                'trader': self.request.user.username,
            }
        }
        if channel_layer is not None:
            async_to_sync(channel_layer.group_send)('officer_notifications', notification)

# --- Officer Views ---
class OfficerApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOfficer]
    queryset = Application.objects.all().select_related('trader').prefetch_related('documents', 'verifications', 'logs')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOfficer])
    def change_status(self, request, pk=None):
        app = self.get_object()
        status_val = request.data.get('status')
        if status_val not in dict(Application.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=400)
        app.status = status_val
        app.save()
        ApplicationLog.objects.create(application=app, action=f"Status changed to {status_val}", performed_by=request.user)
        return Response({'status': 'updated'})

class OfficerVerificationStatusViewSet(viewsets.ModelViewSet):
    serializer_class = VerificationStatusSerializer
    permission_classes = [permissions.IsAuthenticated, IsOfficer]
    queryset = VerificationStatus.objects.all().select_related('application', 'verified_by')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOfficer])
    def verify(self, request, pk=None):
        verification = self.get_object()
        verification.is_verified = request.data.get('is_verified', True)
        verification.comment = request.data.get('comment', '')
        verification.verified_by = request.user
        from django.utils import timezone
        verification.verified_at = timezone.now()
        verification.save()
        ApplicationLog.objects.create(application=verification.application, action=f"{verification.verifier} verification updated", performed_by=request.user)
        return Response({'verified': verification.is_verified})

# --- WhatsApp Webhook Endpoint ---
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class WhatsAppWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        # Placeholder: handle WhatsApp webhook payload
        # Log incoming message
        ChatLog.objects.create(
            user=None,  # You may want to resolve user by phone/email in production
            message=request.data.get('Body', ''),
            response=''  # To be filled after bot responds
        )
        return Response({'status': 'received'})
