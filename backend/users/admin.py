from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar_preview')  # Hiển thị trường user và avatar_preview trong danh sách admin

    def avatar_preview(self, obj):
        if obj.avatar:
            return obj.avatar.url
        else:
            return 'No Avatar'
    avatar_preview.allow_tags = True  # Cho phép hiển thị HTML trong trường dữ liệu
    avatar_preview.short_description = 'Avatar Preview'  # Mô tả ngắn gọn cho trường dữ liệu

admin.site.register(Profile, ProfileAdmin)
