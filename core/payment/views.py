import stripe, requests, paypalrestsdk
from django.conf import settings
from django.shortcuts import render, redirect
from django.urls import reverse, reverse_lazy
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from orders.models import Order
from orders.permissions import IsOrderByBuyerOrAdmin
from payment.models import Payment
from payment.permissions import (DoesOrderHaveAddress,
                                 IsOrderPendingWhenCheckout, IsPaymentByUser,
                                 IsPaymentForOrderNotCompleted,
                                 IsPaymentPending)
from payment.serializers import CheckoutSerializer, PaymentSerializer
from payment.tasks import send_payment_success_email_task
from payment.utils import paypal_token

stripe.api_key = settings.STRIPE_SECRET_KEY

paypalrestsdk.configure({
    "mode": "sandbox",  # Change to "live" for production
    "client_id": settings.PAYPAL_CLIENT_ID,
    "client_secret": settings.PAYPAL_SECRET,
})

class PaymentViewSet(ModelViewSet):
    """
    CRUD payment for an order
    """

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsPaymentByUser]

    # def get_queryset(self):
    #     res = super().get_queryset()
    #     user = self.request.user
    #     return res.filter(order__buyer=user)
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_authenticated:
            return queryset.filter(order__buyer=self.request.user)
        else:
            return Payment.objects.none()  # Trả về queryset rỗng nếu người dùng không được xác thực


    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            self.permission_classes += [IsPaymentPending]

        return super().get_permissions()


class CheckoutAPIView(RetrieveUpdateAPIView):
    """
    Create, Retrieve, Update billing address, shipping address and payment of an order
    """

    queryset = Order.objects.all()
    serializer_class = CheckoutSerializer
    permission_classes = [IsOrderByBuyerOrAdmin]

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH"):
            self.permission_classes += [IsOrderPendingWhenCheckout]

        return super().get_permissions()


class StripeCheckoutSessionCreateAPIView(APIView):
    """
    Create and return checkout session ID for order payment of type 'Stripe'
    """

    permission_classes = (
        IsPaymentForOrderNotCompleted,
        DoesOrderHaveAddress,
    )

    def post(self, request, *args, **kwargs):
        order = get_object_or_404(Order, id=self.kwargs.get("order_id"))

        order_items = []

        for order_item in order.order_items.all():
            product = order_item.product
            quantity = order_item.quantity

            data = {
                "price_data": {
                    "currency": "usd",
                    "unit_amount_decimal": product.price,
                    "product_data": {
                        "name": product.name,
                        "description": product.description if product.description else "No description available",
                    },
                },
                "quantity": quantity,
            }

            order_items.append(data)

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=order_items,
            metadata={"order_id": order.id},
            mode="payment",
            success_url=settings.PAYMENT_SUCCESS_URL,
            cancel_url=settings.PAYMENT_CANCEL_URL,
        )

        return Response(
            {
                "sessionId": checkout_session["id"],
                "paymentUrl": checkout_session["url"]
            },
            status=status.HTTP_201_CREATED
        )


class StripeWebhookAPIView(APIView):
    """
    Stripe webhook API view to handle checkout session completed and other events.
    """

    def post(self, request, format=None):
        payload = request.body
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET
        sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            customer_email = session["customer_details"]["email"]
            order_id = session["metadata"]["order_id"]

            print("Payment successfull")
            print("order_id", order_id)
            try:
                payment = Payment.objects.get(order=order_id)
            except Payment.DoesNotExist:
                print('Không tìm thấy payment')
                return Response(status=status.HTTP_404_NOT_FOUND)

            payment.status = "C"
            payment.save()

            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                print('Không tìm thấy order')
                return Response(status=status.HTTP_404_NOT_FOUND)

            order.status = "C"
            order.save()

            send_payment_success_email_task.delay(customer_email)

            # Decrease product quantity
            for order_item in order.order_items.all():
                product = order_item.product
                quantity = order_item.quantity

                # Calculate the new product quantity
                new_quantity = product.quantity - quantity

                if new_quantity < 0:
                    new_quantity = 0  # Ensure the quantity doesn't go negative

                product.quantity = new_quantity
                product.save()

        # Can handle other events here.

        return Response(status=status.HTTP_200_OK)
        
class CreatePaypalOrderViewRemote(APIView):
    
    permission_classes = (
        IsPaymentForOrderNotCompleted,
        DoesOrderHaveAddress,
    )

    def get(self, request, *args, **kwargs):
        order = get_object_or_404(Order, id=self.kwargs.get("order_id"))
        total_cost_usd = order.total_cost * settings.EXCHANGE_RATE
        token = paypal_token()
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
        }
        json_data = {
            "intent": "CAPTURE",
            "application_context": {
                # "notify_url": "http://localhost:3000/payment/notify/",
                "return_url": "http://localhost:3000/payment/success/",#change to your doma$
                "cancel_url": "http://localhost:3000/payment/cancel/", #change to your domain
            #     "brand_name": "PESAPEDIA SANDBOX",
                "landing_page": "NO_PREFERENCE",
            #     "shipping_preference": "NO_SHIPPING",
            #     "user_action": "CONTINUE"
            },
            "purchase_units": [
                {
                    # "reference_id": "294375635",
                    "reference_id": "d9f80740-38f0-11e8-b467-0ed5f89f718b",
                    "description": "HoangLoc Book Store",

                    "amount": {
                        "currency_code": "USD",
                        "value": str(round(total_cost_usd, 2))  #amount,
                        # "value": "20"
                    },
                }
            ]
        }
        response = requests.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', headers=headers, json=json_data)
        order_id = response.json()['id']
        linkForPayment = response.json()['links'][1]['href']
        return Response({"linkForPayment": linkForPayment, "orderId" : order_id, "token": token})

class CheckoutPaypalOrderView(APIView):
    permission_classes = (
        IsPaymentForOrderNotCompleted,
        DoesOrderHaveAddress,
    )
    def post(self, request, *args, **kwargs):
        token = paypal_token()
        id = request.data.get('id', '')
        orderId = request.data.get('orderId', '')
        captureurl = f"https://api.sandbox.paypal.com/v2/checkout/orders/{id}" #captureurl = 'https://api.sandbox.paypal.com/v2/checkout/orders/6KF61042TG097104C/capture'#see transaction status
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+token
        }
        res = requests.get(captureurl, headers=headers)
        print('---------------------Status là:', res.json())
        try:
            response = requests.get(captureurl, headers=headers)
            status = response.json()['status']
            if status == 'COMPLETED':
                print('--------------------Paypal payment success!-------------------------')
                payment = get_object_or_404(Payment, order=orderId)
                payment.status = "C"
                payment.save()

                order = get_object_or_404(Order, id=orderId)
                order.status = "C"
                order.save()

                # send_payment_success_email_task.delay(order.customer_email)

                for order_item in order.order_items.all():
                    product = order_item.product
                    quantity = order_item.quantity
                    new_quantity = max(product.count_in_stock - quantity, 0)
                    product.count_in_stock = new_quantity
                    product.save()
            return Response({"status": status, "token": token})
        except Exception as e:
            return Response({"error": str(e), "id": id, "orderId": orderId, "status": status})