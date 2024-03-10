from django.contrib import admin
from .models import Product, ProductCategory, ProductImage, Author
from import_export.admin import ImportExportMixin

class ProductAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ['category','author' , 'name', 'description', 'price', 'count_in_stock', 'available']
    
class AuthorAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ['name']
    
class ProductImageAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ['image', 'name']
    
class ProductCategoryAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ['name', 'image', 'slug']

# Register your models here.

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductCategory, ProductCategoryAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Author, AuthorAdmin)