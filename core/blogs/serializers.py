from rest_framework import serializers
from .models import Post, Content

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    content = ContentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = "__all__"

