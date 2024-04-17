from django_filters import rest_framework as filters
from .models import Product

class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="final_price", lookup_expr='gte')
    max_price = filters.NumberFilter(field_name="final_price", lookup_expr='lte')
    available = filters.BooleanFilter(field_name="available")

    class Meta:
        model = Product
        fields = ['category', 'final_price', 'available']
    
    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        ordering = self.request.query_params.get('sort_by', None)
        if ordering:
            queryset = queryset.order_by(ordering)
            
        query_params = self.request.query_params.dict()
        
        for key, value in query_params.items():
            if key in self.form.fields:
                queryset = self.filters[key].filter(queryset, value)
        return queryset