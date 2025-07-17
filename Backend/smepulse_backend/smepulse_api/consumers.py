import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class OfficerNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated or getattr(user, 'user_type', None) != 'officer':
            await self.close()
            return
        # For demo: join a group based on officer's office, or a general group
        self.group_name = f"officer_notifications"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Officers don't send messages, so ignore
        pass

    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["data"])) 