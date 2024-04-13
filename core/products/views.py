from django.shortcuts import render
from .serializers import (ProductCategoryReadSerializer, 
                          ProductImageReadSerializer, 
                          AuthorReadSerializer, 
                          ProductReadSerializer, 
                          ProductWriteSerializer)
from .models import Product, ProductCategory, ProductImage, Author
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, permissions, generics
from django.shortcuts import get_object_or_404

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all().order_by('name')
    serializer_class = ProductCategoryReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all().order_by('name')
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD products
    """
    queryset = Product.objects.all()
    pagination_class = PageNumberPagination
    
    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return ProductWriteSerializer
        
        return ProductReadSerializer            
    
    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser, )
        else:
            self.permission_classes = (permissions.AllowAny, )
            
        return super().get_permissions()
    
class ProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author)
    
class ProductSlugListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        product_slug = self.kwargs['product_slug']
        product = get_object_or_404(Product, slug=product_slug)
        return [product]
    
class ProductCategorySlugListView(generics.ListAPIView):
    serializer_class = ProductCategoryReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        productcategory_slug = self.kwargs['category_slug']
        productcategory = get_object_or_404(ProductCategory, slug=productcategory_slug)
        return [productcategory]

class AuthorSlugListView(generics.ListAPIView):
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return [author]

class ProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category)
    
class ProductByCategoryNameListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_name = self.kwargs['category_name']
        category = get_object_or_404(ProductCategory, name=category_name)
        return Product.objects.filter(category=category)
    
class AllProductsListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class AllCategoriesListView(generics.ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategoryReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class AllAuthorsListView(generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class AuthorByProductSlugListView(generics.ListAPIView):
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        product_slug = self.kwargs['product_slug']
        product = get_object_or_404(Product, slug=product_slug)
        return Author.objects.filter(name=product.author)
    
class AuthorByAuthorNameListView(generics.ListAPIView):
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_name = self.kwargs['author_name']
        author = get_object_or_404(Author, name=author_name)
        return [author]
    
class SortBestSellingProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('-sold_count')
    serializer_class = ProductReadSerializer
    
class SortNameAscProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('name')
    serializer_class = ProductReadSerializer
    
class SortNameDescProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('-name')
    serializer_class = ProductReadSerializer
    
class SortPriceAscProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('price')
    serializer_class = ProductReadSerializer
    
class SortPriceDescProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('-price')
    serializer_class = ProductReadSerializer
    
class SortDateAscProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('-created_at')
    serializer_class = ProductReadSerializer
    
class SortDateDescProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('created_at')
    serializer_class = ProductReadSerializer
    

class SortBestSellingProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('-sold_count')

class SortNameAscProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('name')

class SortNameDescProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('-name')

class SortPriceAscProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('price')

class SortPriceDescProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('-price')

class SortDateAscProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('created_at')

class SortDateDescProductByAuthorListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        author_slug = self.kwargs['author_slug']
        author = get_object_or_404(Author, slug=author_slug)
        return Product.objects.filter(author=author, available=True).order_by('-created_at')

class SortBestSellingProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('-sold_count')

class SortNameAscProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('name')

class SortNameDescProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('-name')

class SortPriceAscProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('price')

class SortPriceDescProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('-price')

class SortDateAscProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('created_at')

class SortDateDescProductByCategoryListView(generics.ListAPIView):
    serializer_class = ProductReadSerializer
    permission_classes = (permissions.AllowAny, )

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(ProductCategory, slug=category_slug)
        return Product.objects.filter(category=category, available=True).order_by('-created_at')
