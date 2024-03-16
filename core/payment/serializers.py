from rest_framework import serializers

from orders.models import Order
from payment.models import Payment


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
    """
    Serializer class to set or update shipping address, billing address and payment of an order.
    """

    payment = PaymentOptionSerializer()

    class Meta:
        model = Order
        fields = (
            "id",
            "payment",
        )

    def update(self, instance, validated_data):
        order_shipping_address = None
        order_billing_address = None
        order_payment = None

        payment = validated_data["payment"]

        # Payment option is not set for an order
        if not instance.payment:
            order_payment = Payment(**payment, order=instance)
            order_payment.save()

        else:
            # Payment option is set so update its value
            p = Payment.objects.filter(order=instance)
            p.update(**payment)

            order_payment = p.first()

        # Update order
        instance.payment = order_payment
        instance.save()

        return instance