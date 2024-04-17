from django.contrib import admin
from blogs.models import Post, Content
from django import forms

class ContentInlineForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(ContentInlineForm, self).__init__(*args, **kwargs)
        self.fields['post'].widget = forms.Select(choices=[(post.id, post.title) for post in Post.objects.all()])

class ContentInline(admin.TabularInline):
    model = Content
    form = ContentInlineForm
    extra = 1

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'type', 'subtype')
    search_fields = ('title', 'type', 'subtype')
    inlines = [ContentInline]
    readonly_fields = ('content_order',)
    
    def content_order(self, obj):
        return ", ".join(str(content.image_number) for content in obj.content.all())
    
    content_order.short_description = 'Content Order'

admin.site.register(Post, PostAdmin)
admin.site.register(Content)
