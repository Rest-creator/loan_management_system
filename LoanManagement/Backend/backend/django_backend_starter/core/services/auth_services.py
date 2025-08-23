from django_backend_starter.apps.loan.models import UserModel
from ..repositories.user_repository_impl import UserRepositoryImpl
from ..repositories.audit_repository import AuditRepository

class AuthService:
    def __init__(self):
        self.user_repo = UserRepositoryImpl()  # ✅ concrete
        self.audit_repo = AuditRepository()

    def login(self, email, password, ip=None, ua=None):
        user, error = self.user_repo.authenticate_user(email, password)

        if error:
            # If user exists but is locked
            if user is None:
                self.audit_repo.log_event(
                    email=email, event_type="FAILURE", ip=ip, ua=ua
                )
                raise ValueError(error)

            if error.startswith("Account locked"):
                self.audit_repo.log_event(
                    user=user, email=email, event_type="LOCKOUT", ip=ip, ua=ua
                )
                raise ValueError(error)

        # Success
        self.audit_repo.log_event(user=user, email=email, event_type="SUCCESS", ip=ip, ua=ua)
        return user



        
