from django.contrib import admin
from .models import CustomUser, PetOwner, PetMinder, Review
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ('User Role', {'fields': ('role',)}),
    )
    list_display = ('username', 'email', 'role')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(PetOwner)
admin.site.register(PetMinder)
admin.site.register(Review) 