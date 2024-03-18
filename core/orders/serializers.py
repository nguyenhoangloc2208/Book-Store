from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from orders.models import Order, OrderItem
from rest_framework.permissions import IsAuthenticated, AllowAny


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer class for serializing order items
    """

    price = serializers.SerializerMethodField()
    cost = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "order",
            "product",
            "quantity",
            "price",
            "cost",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("order",)

    def validate(self, validated_data):
        order_quantity = validated_data["quantity"]
        product_quantity = validated_data["product"].count_in_stock

        order_id = self.context["view"].kwargs.get("order_id")
        product = validated_data["product"]
        current_item = OrderItem.objects.filter(
            order__id=order_id, product=product)

        if order_quantity > product_quantity:
            error = {"quantity": _("Ordered quantity is more than the stock.")}
            raise serializers.ValidationError(error)

        if not self.instance and current_item.count() > 0:
            error = {"product": _("Product already exists in your order.")}
            raise serializers.ValidationError(error)

        return validated_data

    def get_price(self, obj):
        return obj.product.price

    def get_cost(self, obj):
        return obj.cost


class OrderReadSerializer(serializers.ModelSerializer):
    """
    Serializer class for reading orders
    """

    buyer = serializers.CharField(source="buyer.get_full_name", read_only=True)
    order_items = OrderItemSerializer(read_only=True, many=True)
    total_cost = serializers.SerializerMethodField(read_only=True)
    total_quantity = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "buyer",
            # "payment",
            "order_items",
            "total_cost",
            "total_quantity",
            "status",
            "created_at",
            "updated_at",
        )

    def get_total_cost(self, obj):
        return obj.total_cost
    def get_total_quantity(self, obj):
        return obj.total_quantity


class OrderWriteSerializer(serializers.ModelSerializer):
    """
    Serializer class for creating orders and order items

    Shipping address, billing address and payment are not included here
    They will be created/updated on checkout
    """

    buyer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "buyer",
            "status",
            "order_items",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("buyer",)
    
    def get_permissions(self):
        if self.context['request'].method in ['POST', 'GET', 'DELETE']:
            return [IsAuthenticated()]  # Chỉ cho phép người dùng đã đăng nhập
        else:
            return [AllowAny()]

    def create(self, validated_data):
        buyer = validated_data.pop("buyer")
        pending_order = Order.objects.filter(buyer=buyer, status=Order.PENDING).first()
        if pending_order:
            raise serializers.ValidationError({"error": "There is already a pending order for this user."})
        status = validated_data.pop("status")
        orders_data = validated_data.pop("order_items")
        order = Order.objects.create(buyer=buyer, status=status) 
        
        for order_data in orders_data:
            OrderItem.objects.create(order=order, **order_data)

        return order

    def update(self, instance, validated_data):
        pass