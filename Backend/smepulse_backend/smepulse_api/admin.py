from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Office

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'office', 'status', 'is_active')
    list_filter = ('status', 'office', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions', 'status'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Work Information', {'fields': ('office', 'reason')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
admin.site.register(Office)