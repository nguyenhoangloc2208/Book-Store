from django_filters import rest_framework as filters
from .models import Product
from unidecode import unidecode
import urllib.parse
from django.db.models import Q

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="final_price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="final_price", lookup_expr='lte')
    available = filters.BooleanFilter(field_name="available")
    name = filters.CharFilter(method='custom_name_filter')

    class Meta:
        model = Product
        fields = ['category', 'final_price', 'available', 'name']
    
    def filter_name(self, queryset, name, value):
        if value:
            # Giải mã URL để đảm bảo rằng "Á" được hiểu là "a"
            decoded_value = urllib.parse.unquote(value)
            # Chuyển đổi giá trị tìm kiếm và dữ liệu trong cơ sở dữ liệu thành dạng không dấu
            normalized_value = unidecode(decoded_value.lower())
            # Tìm kiếm không phân biệt chữ hoa, chữ thường và không phân biệt dấu
            return queryset.filter(name__icontains=normalized_value)
        return queryset
    
    def custom_name_filter(self, queryset, name, value):
        words = value.split()  # Tách từng từ trong giá trị nhập vào
        q_objects = Q()

        for word in words:
            # Tạo các biến thể của từ và thêm vào danh sách biến thể
            variations = {word.lower(), word.upper(), word.capitalize()}
            variations.add(word.replace('+', '').lower())
            variations.add(word.replace('+', '').upper())

            # Tạo điều kiện lọc cho mỗi biến thể và kết hợp bằng phép OR
            for variation in variations:
                q_objects |= Q(name__icontains=variation)

        return queryset.filter(q_objects)