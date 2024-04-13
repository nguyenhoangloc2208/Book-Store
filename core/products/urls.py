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
                    ProductByCategoryNameListView,
                    ProductCategorySlugListView,
                    AuthorSlugListView,
                    SortBestSellingProductListView,
                    SortDateAscProductListView,
                    SortDateDescProductListView,
                    SortNameAscProductListView,
                    SortNameDescProductListView,
                    SortPriceAscProductListView,
                    SortPriceDescProductListView,
                    SortBestSellingProductByAuthorListView,
                    SortDateAscProductByAuthorListView,
                    SortDateDescProductByAuthorListView,
                    SortNameAscProductByAuthorListView,
                    SortNameDescProductByAuthorListView,
                    SortPriceAscProductByAuthorListView,
                    SortPriceDescProductByAuthorListView,
                    SortBestSellingProductByCategoryListView,
                    SortDateAscProductByCategoryListView,
                    SortDateDescProductByCategoryListView,
                    SortNameAscProductByCategoryListView,
                    SortNameDescProductByCategoryListView,
                    SortPriceAscProductByCategoryListView,
                    SortPriceDescProductByCategoryListView)

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
    path('author_slug/<str:author_slug>/', AuthorSlugListView.as_view(), name='author-slug'),
    path('productcategory_slug/<str:category_slug>/', ProductCategorySlugListView.as_view(), name='productcategory-slug'),
    path('author_by_product_slug/<str:product_slug>/', AuthorByProductSlugListView.as_view(), name='author-by-product-slug'),
    path('author_by_author_name/<str:author_name>/', AuthorByAuthorNameListView.as_view(), name='author-by-author-name'),
    path('product_by_category_slug/<str:category_slug>/', ProductByCategoryListView.as_view(), name='product-by-category-slug'),
    path('product_by_category_name/<str:category_name>/', ProductByCategoryNameListView.as_view(), name='product-by-category-name'),
    path('products/all_products/', AllProductsListView.as_view(), name='all-products'),
    path('products/all_authors/', AllAuthorsListView.as_view(), name='all-authors'),
    path('products/all_categories/', AllCategoriesListView.as_view(), name='all-categories'),
]

urlpatterns += [
    path('products/sort-by-best-selling/', SortBestSellingProductListView.as_view(), name='sort_by_best-selling'),
    path('products/sort-by-name-asc/', SortNameAscProductListView.as_view(), name='sort_by_name_asc'),
    path('products/sort-by-name-desc/', SortNameDescProductListView.as_view(), name='sort_by_name_desc'),
    path('products/sort-by-price-asc/', SortPriceAscProductListView.as_view(), name='sort_by_price_asc'),
    path('products/sort-by-price-desc/', SortPriceDescProductListView.as_view(), name='sort_by_price_desc'),
    path('products/sort-by-date-asc/', SortDateAscProductListView.as_view(), name='sort_by_date_asc'),
    path('products/sort-by-date-desc/', SortDateDescProductListView.as_view(), name='sort_by_date_desc'),
]

urlpatterns += [
    path('products_by_author_slug/sort-by-best-selling/<str:author_slug>/', SortBestSellingProductByAuthorListView.as_view(), name='sort_by_best-selling'),
    path('products_by_author_slug/sort-by-name-asc/<str:author_slug>/', SortNameAscProductByAuthorListView.as_view(), name='sort_by_name_asc'),
    path('products_by_author_slug/sort-by-name-desc/<str:author_slug>/', SortNameDescProductByAuthorListView.as_view(), name='sort_by_name_desc'),
    path('products_by_author_slug/sort-by-price-asc/<str:author_slug>/', SortPriceAscProductByAuthorListView.as_view(), name='sort_by_price_asc'),
    path('products_by_author_slug/sort-by-price-desc/<str:author_slug>/', SortPriceDescProductByAuthorListView.as_view(), name='sort_by_price_desc'),
    path('products_by_author_slug/sort-by-date-asc/<str:author_slug>/', SortDateAscProductByAuthorListView.as_view(), name='sort_by_date_asc'),
    path('products_by_author_slug/sort-by-date-desc/<str:author_slug>/', SortDateDescProductByAuthorListView.as_view(), name='sort_by_date_desc'),
]

urlpatterns += [
    path('products_by_category_slug/sort-by-best-selling/<str:category_slug>/', SortBestSellingProductByCategoryListView.as_view(), name='sort_by_best-selling_category'),
    path('products_by_category_slug/sort-by-name-asc/<str:category_slug>/', SortNameAscProductByCategoryListView.as_view(), name='sort_by_name_asc_category'),
    path('products_by_category_slug/sort-by-name-desc/<str:category_slug>/', SortNameDescProductByCategoryListView.as_view(), name='sort_by_name_desc_category'),
    path('products_by_category_slug/sort-by-price-asc/<str:category_slug>/', SortPriceAscProductByCategoryListView.as_view(), name='sort_by_price_asc_category'),
    path('products_by_category_slug/sort-by-price-desc/<str:category_slug>/', SortPriceDescProductByCategoryListView.as_view(), name='sort_by_price_desc_category'),
    path('products_by_category_slug/sort-by-date-asc/<str:category_slug>/', SortDateAscProductByCategoryListView.as_view(), name='sort_by_date_asc_category'),
    path('products_by_category_slug/sort-by-date-desc/<str:category_slug>/', SortDateDescProductByCategoryListView.as_view(), name='sort_by_date_desc_category'),
]
