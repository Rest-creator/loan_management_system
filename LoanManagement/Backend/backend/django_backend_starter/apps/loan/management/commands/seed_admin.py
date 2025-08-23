# django_backend_starter/management/commands/seed_admin.py
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django_backend_starter.apps.loan.models import UserModel  # adjust if needed

class Command(BaseCommand):
    help = "Seeds the default admin user"

    def handle(self, *args, **options):
        email = "admin@probitas.com"
        password = "Admin@123"  # change as needed
        first_name = "Admin"
        last_name = "User"

        if UserModel.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING("Admin user already exists."))
            return

        admin_user = UserModel(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role="admin",
            is_active=True,
            password=make_password(password)  # hashed password
        )
        admin_user.save()
        self.stdout.write(self.style.SUCCESS(f"Admin user {email} created successfully."))
