from rest_framework import serializers
from orders.models import Order
from payment.models import Payment

from users.serializers import (BillingAddressSerializer,
                               ShippingAddressSerializer,
                               AddressSerializer)

from users.models import Address


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer to CRUD payments for an order.
    """

    buyer = serializers.CharField(
        source="order.buyer.get_full_name", read_only=True)

    class Meta:
        model = Payment
        fields = (
            "id",
            "buyer",
            "status",
            "payment_option",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("status",)


class PaymentOptionSerializer(serializers.ModelSerializer):
    """
    Payment serializer for checkout. Order will be automatically set during checkout.
    """

    buyer = serializers.CharField(
        source="order.buyer.get_full_name", read_only=True)

    class Meta:
        model = Payment
        fields = (
            "id",
            "buyer",
            "status",
            "payment_option",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("status", "order")



class CheckoutSerializer(serializers.ModelSerializer):
    address_id = serializers.IntegerField(required=False)
    payment_id = serializers.IntegerField(required=False)

    class Meta:
        model = Order
        fields = (
            "id",
            "address_id",
            "payment_id",
        )

    def update(self, instance, validated_data):
        address_id = validated_data.get("address_id")
        payment_id = validated_data.get("payment_id")

        if address_id:
            address = Address.objects.get(pk=address_id)
            if address.address_type == 'B':
                instance.billing_address = address
                instance.shipping_address = None
            elif address.address_type == 'S':
                instance.shipping_address = address
                instance.billing_address = None

        if payment_id:
            payment = Payment.objects.get(pk=payment_id)
            instance.payment = payment
        
        instance.save()
        return instance