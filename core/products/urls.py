from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProductCategoryViewSet, AuthorViewSet, ProductViewSet

app_name = 'products'

router = DefaultRouter()
router.register(r"categories", ProductCategoryViewSet, basename="categories")
router.register(r"authors", AuthorViewSet, basename="authors")
router.register(r"", ProductViewSet, basename="products")

urlpatterns = [
    path("", include(router.urls)),
]