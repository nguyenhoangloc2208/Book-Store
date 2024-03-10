from django.shortcuts import render
from .serializers import (ProductCategoryReadSerializer, 
                          ProductImageReadSerializer, 
                          AuthorReadSerializer, 
                          ProductReadSerializer, 
                          ProductWriteSerializer)
from .models import Product, ProductCategory, ProductImage, Author

from rest_framework import viewsets, permissions

# Create your views here.

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategoryReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorReadSerializer
    permission_classes = (permissions.AllowAny, )
    
class ProductViewSet(viewsets.ModelViewSet):
    """
    CRUD products
    """
    queryset = Product.objects.all()
    
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