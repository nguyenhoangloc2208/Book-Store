from django.contrib import admin
from .models import PhoneNumber, Profile

# Register your models here.

admin.site.register(PhoneNumber)
admin.site.register(Profile)