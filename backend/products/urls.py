from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (ProductCategoryViewSet, 
                    AuthorViewSet, 
                    ProductViewSet, 
                    ProductByAuthorListView, 
                    ProductByCategoryListView,
                    ProductSlugListView,
                    AuthorByAuthorNameListView,
                    ProductCategorySlugListView,
                    AuthorSlugListView,
                    ProductByCategoryNameListView
                    )

app_name = 'products'

router = DefaultRouter()
router.register(r"categories", ProductCategoryViewSet, basename="categories")
router.register(r"authors", AuthorViewSet, basename="authors")
router.register(r"", ProductViewSet, basename="products")

urlpatterns = [
    path("", include(router.urls)),
]

urlpatterns += [
    path('product_slug/<str:product_slug>/', ProductSlugListView.as_view(), name='product-slug'),
    path('author_slug/<str:author_slug>/', AuthorSlugListView.as_view(), name='author-slug'),
    path('productcategory_slug/<str:category_slug>/', ProductCategorySlugListView.as_view(), name='productcategory-slug'),
    path('author_by_author_name/<str:author_name>/', AuthorByAuthorNameListView.as_view(), name='author-by-author-name'),
    path('product_by_category_name/<str:category_name>/', ProductByCategoryNameListView.as_view(), name='product-by-category-name'),
    
]

urlpatterns += [
    path('product_by_author_slug/<str:author_slug>/', ProductByAuthorListView.as_view(), name='product-by-author-slug'),
    path('product_by_category_slug/<str:category_slug>/', ProductByCategoryListView.as_view(), name='product-by-category-slug'),
]
