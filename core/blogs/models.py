from django.db import models
from products.utilities import custom_slugify, blogs_image_path, blogs_post_image_path
import os

class Post(models.Model):
    PAGE_TYPE = 'page'
    BLOG_TYPE = 'blog'
    TYPE_CHOICES = [
        (PAGE_TYPE, 'Page'),
        (BLOG_TYPE, 'Blog'),
    ]

    REVIEW_TYPE = 'review'
    RELEASE_TYPE = 'release'
    BLOG_SUBTYPES_CHOICES = [
        (REVIEW_TYPE, 'Review'),
        (RELEASE_TYPE, 'Release'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default=BLOG_TYPE)
    subtype = models.CharField(max_length=10, choices=BLOG_SUBTYPES_CHOICES, blank=True, null=True)
    image_title = models.ImageField(upload_to=blogs_post_image_path, null=True, blank=True)
    post_paragraph = models.TextField(default='', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug and self.title:  
            self.slug = custom_slugify(self.title)
        super(Post, self).save(*args, **kwargs)
        
    def __str__(self):
        return self.title

class Content(models.Model):
    post = models.ForeignKey(Post, related_name='content', on_delete=models.CASCADE)
    paragraph = models.TextField()
    image = models.ImageField(upload_to=blogs_image_path, null=True, blank=True)
    image_number = models.IntegerField(default=0)  # Số thứ tự của hình ảnh
    image_alt = models.CharField(max_length=100, blank=True)  # Alt của hình ảnh
    content_title = models.CharField(max_length=200, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.image_alt and self.image:
            # Tạo image_alt từ tên của hình ảnh nếu không có image_alt
            self.image_alt = os.path.basename(self.image.name)
        super(Content, self).save(*args, **kwargs)

    def __str__(self):
        return self.post.title