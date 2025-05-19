from django.contrib import admin
from .models import (
    User, JenisUnggas, FaseUnggas, BahanPakan,
    KebutuhanNutrien, Formulasi, BahanFormulasi
)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Admin untuk model user
class UserAdmin(BaseUserAdmin):
    ordering = ['email']
    list_display = ['email', 'name', 'user_type', 'is_active']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informasi Personal', {'fields': ('name', 'phone_number')}),
        ('Hak Akses', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser')}),
        ('Tanggal Penting', {'fields': ('last_login', 'created_at', 'deleted_at')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'user_type'),
        }),
    )
    search_fields = ['email', 'name']

admin.site.register(User, UserAdmin)
admin.site.register(JenisUnggas)
admin.site.register(FaseUnggas)
admin.site.register(BahanPakan)
admin.site.register(KebutuhanNutrien)
admin.site.register(Formulasi)
admin.site.register(BahanFormulasi)