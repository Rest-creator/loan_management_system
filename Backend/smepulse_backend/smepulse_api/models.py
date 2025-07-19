from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import RegexValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
class Office(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class User(AbstractUser):
    OFFICE_CHOICES = [
        ('zimra', 'ZIMRA'),
        ('harare_council', 'Harare City Council'),
        ('chitungwiza_minucipal', 'Chitungwiza Municipal'),
        ('ministry_smes', 'Ministry of Women Affairs, Community, Small and Medium Enterprises Development'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
      # Add a role field
    ROLE_CHOICES = [
        ('user', 'Regular User'),
        ('officer', 'Officer'),
        ('admin', 'Administrator'),
    ]
    username = None  # <--- Important: remove username
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Required if you're using createsuperuser without username


    # Additional fields
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+263771234567'. Up to 15 digits allowed."
    )
    phone = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    # Added a default value here for 'office'
    office = models.CharField(max_length=50, choices=OFFICE_CHOICES, default='zimra') # <<< ADDED DEFAULT
    reason = models.TextField(default="Reason for requesting access")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    objects = CustomUserManager()
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user') # Add this line

    def __str__(self):
        return f"{self.get_full_name()} ({self.email}) - {self.get_status_display()}"
    


class Application(models.Model):
    # Example fields, adjust as per your actual application data
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('needs_clarification', 'Needs Clarification'),
        # Add other statuses as needed
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # Foreign key to Office
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='applications')
    # Optional: Link to a user if applications are submitted by users
    submitted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='submitted_applications')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()} ({self.office.name})"


