from django.urls import path
from .views import BlogListCreateAPIView, BlogRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('blogs/', BlogListCreateAPIView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', BlogRetrieveUpdateDestroyAPIView.as_view(), name='blog-detail'),
]