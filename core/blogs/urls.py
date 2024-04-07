from django.urls import path
from .views import PostRetrieveAPIView, PostRetrieveBySlugAPIView, PostListAPIView, BlogPostReleaseListAPIView, BlogPostReviewListAPIView

app_name = "blogs"


urlpatterns = [
    path('posts/', PostListAPIView.as_view(), name='post-list'),
    path('reviews/', BlogPostReviewListAPIView.as_view(), name='blog-review-list'),
    path('release/', BlogPostReleaseListAPIView.as_view(), name='blog-release-list'),
    path('posts/<int:pk>/', PostRetrieveAPIView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/', PostRetrieveBySlugAPIView.as_view(), name='post-detail-by-slug'),
]
