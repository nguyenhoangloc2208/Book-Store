from rest_framework import serializers
from .models import ProductCategory, Product, Author, ProductImage

class ProductCategoryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"
        
class AuthorReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"
        
class ProductImageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"
        
class ProductReadSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', queryset=ProductCategory.objects.all())
    author = serializers.SlugRelatedField(slug_field='name', queryset=Author.objects.all(), allow_null=True)
    image = ProductImageReadSerializer(many=True)
    
    id = serializers.IntegerField(source='pk')
    
    class Meta:
        model = Product
        fields = "__all__"
        
class ProductWriteSerializer(serializers.ModelSerializer):
    category = ProductCategoryReadSerializer()
    author = AuthorReadSerializer(allow_null=True)
    
    class Meta:
        model = Product
        fields = '__all__'
        
    def create(self, validated_data):
        category_data = validated_data.pop("category")
        author_data = validated_data.pop("author")
        category, _ = ProductCategory.objects.get_or_create(**category_data)
        author, _ = Author.objects.get_or_create(**author_data)        
        product = Product.objects.create(**validated_data, category=category, author=author)
        
        return product
    
    # def update(self, instance, validated_data):
    #     if "category" in validated_data:
    #         category_data = validated_data.pop("category")
    #         category, _ = ProductCategory.objects.get_or_create(**category_data)
    #         instance.category = category

    #     if "author" in validated_data:
    #         author_data = validated_data.pop("author")
    #         author, _ = Author.objects.get_or_create(**author_data)
    #         instance.author = author

    #     instance.name = validated_data.get("name", instance.name)
    #     instance.description = validated_data.get("description", instance.description)
    #     instance.price = validated_data.get("price", instance.price)
    #     instance.count_in_stock = validated_data.get("count_in_stock", instance.count_in_stock)
    #     instance.available = validated_data.get("available", instance.available)

    #     instance.save()
    #     return instance

