from django.conf import settings
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import User

@receiver(post_migrate)
def create_default_admin(sender, **kwargs):
    if not User.objects.filter(email="admin@smepulse.gov.zw").exists():
        User.objects.create_superuser(
            email="admin@smepulse.gov.zw",
            password="admin@123"
        )
        print("✅ Default admin user created.")
    else:
        print("ℹ️ Admin user already exists.")
