# django_backend_starter/apps/loan/core/interfaces/user_repository.py

from abc import ABC, abstractmethod
from ..entities.user import UserEntity

class IUserRepository(ABC):
    @abstractmethod
    def get_by_email(self, email: str) -> UserEntity | None:
        pass
