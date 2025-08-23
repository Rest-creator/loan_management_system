from datetime import timedelta
import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db.models import Max
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)
        return self.create_user(email, password, **extra_fields)
    
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_TIME = timedelta(minutes=15)

class UserModel(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    employee_id = models.CharField(max_length=10, unique=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    contact_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(
        max_length=50,
        choices=[("admin", "Admin"), ("agent", "Agent")],
        default="agent"
    )
    branch = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    is_suspended = models.BooleanField(default=False)
    suspension_reason = models.TextField(blank=True, null=True)
    suspension_time = models.DateTimeField(blank=True, null=True)

    password_last_changed = models.DateTimeField(default=timezone.now)
    
    failed_login_attempts = models.IntegerField(default=0)
    lockout_until = models.DateTimeField(null=True, blank=True)

    PASSWORD_EXPIRY_DAYS = 90

    def is_password_expired(self):
        return timezone.now() > self.password_last_changed + timedelta(days=self.PASSWORD_EXPIRY_DAYS)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # prompts when creating superuser

    def suspend(self, reason: str = ""):
        self.is_suspended = True
        self.suspension_reason = reason
        self.suspension_time = timezone.now()
        self.save()

    def reactivate(self):
        self.is_suspended = False
        self.suspension_reason = None
        self.suspension_time = None
        self.save()

    def can_login(self):
        if self.is_suspended:
            return False
        if hasattr(self, "is_locked") and self.is_locked():
            return False
        return True
    
    def is_locked(self):
        if self.lockout_until and timezone.now() < self.lockout_until:
            return True
        return False

    def register_failed_attempt(self):
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
            self.lockout_until = timezone.now() + LOCKOUT_TIME
        self.save(update_fields=['failed_login_attempts', 'lockout_until'])

    def reset_failed_attempts(self):
        self.failed_login_attempts = 0
        self.lockout_until = None
        self.save(update_fields=['failed_login_attempts', 'lockout_until'])

    def save(self, *args, **kwargs):
        if not self.employee_id:
            last_emp = UserModel.objects.aggregate(max_id=Max('employee_id'))['max_id']
            num = int(last_emp.replace('EMP', '')) + 1 if last_emp else 1
            self.employee_id = f"EMP{num:03d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"


class PasswordHistory(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name="password_history")
    password_hash = models.CharField(max_length=128)  # store hashed password
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name_plural = "Password Histories"

    def __str__(self):
        return f"{self.user.email} - {self.timestamp}"


class AdminAudit(models.Model):
    ACTION_CHOICES = [
        ("SUSPEND_USER", "Suspended User"),
        ("REACTIVATE_USER", "Reactivated User"),
        ("CREATE_AGENT", "Created Agent"),
        # you can add more actions as needed
    ]

    admin = models.ForeignKey(
        "UserModel", on_delete=models.SET_NULL, null=True, related_name="admin_actions"
    )
    target_user = models.ForeignKey(
        "UserModel", on_delete=models.SET_NULL, null=True, blank=True, related_name="targeted_by_admin"
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    reason = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"[{self.timestamp}] {self.admin} performed {self.action} on {self.target_user}"

class LoginAudit(models.Model):
    EVENT_CHOICES = [
        ("SUCCESS", "Successful Login"),
        ("FAILURE", "Failed Login"),
        ("LOCKOUT", "Account Locked"),
    ]

    user = models.ForeignKey(
        "UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )
    email_attempted = models.EmailField(null=True, blank=True)  # in case user not found
    event_type = models.CharField(max_length=20, choices=EVENT_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"[{self.timestamp}] {self.email_attempted} - {self.event_type}"

