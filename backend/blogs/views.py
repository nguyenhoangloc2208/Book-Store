from rest_framework import generics
from .models import Post
from .serializers import PostSerializer, MyPagination

class BlogPostReviewListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = MyPagination
    
    def get_queryset(self):
        return Post.objects.filter(type="blog", subtype="review")

class BlogPostReleaseListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = MyPagination

    def get_queryset(self):
        return Post.objects.filter(type="blog", subtype="release")

class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    pagination_class = MyPagination
    serializer_class = PostSerializer

class PostRetrieveAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'id'
    
class PostRetrieveBySlugAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    
