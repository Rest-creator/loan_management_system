from django.apps import AppConfig


class SmepulseApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'smepulse_api'

def ready(self):
    import signals  # 👈 import the signals module

