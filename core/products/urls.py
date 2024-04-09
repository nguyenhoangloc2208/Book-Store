from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (ProductCategoryViewSet, 
                    AuthorViewSet, 
                    ProductViewSet, 
                    ProductByAuthorListView, 
                    ProductByCategoryListView,
                    AllProductsListView,
                    AllAuthorsListView,
                    AllCategoriesListView,
                    ProductSlugListView,
                    AuthorByProductSlugListView,
                    AuthorByAuthorNameListView,
                    ProductByCategoryNameListView)

app_name = 'products'

router = DefaultRouter()
router.register(r"categories", ProductCategoryViewSet, basename="categories")
router.register(r"authors", AuthorViewSet, basename="authors")
router.register(r"", ProductViewSet, basename="products")

urlpatterns = [
    path("", include(router.urls)),
]

urlpatterns += [
    path('product_by_author_slug/<str:author_slug>/', ProductByAuthorListView.as_view(), name='product-by-author-slug'),
    path('product_slug/<str:product_slug>/', ProductSlugListView.as_view(), name='product-slug'),
    path('author_by_product_slug/<str:product_slug>/', AuthorByProductSlugListView.as_view(), name='author-by-product-slug'),
    path('author_by_author_name/<str:author_name>/', AuthorByAuthorNameListView.as_view(), name='author-by-author-name'),
    path('product_by_category_slug/<str:category_slug>/', ProductByCategoryListView.as_view(), name='product-by-category-slug'),
    path('product_by_category_name/<str:category_name>/', ProductByCategoryNameListView.as_view(), name='product-by-category-name'),
    path('products/all_products/', AllProductsListView.as_view(), name='all-products'),
    path('products/all_authors/', AllAuthorsListView.as_view(), name='all-authors'),
    path('products/all_categories/', AllCategoriesListView.as_view(), name='all-categories'),
]