from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (CheckoutAPIView, 
                    PaymentViewSet, 
                    StripeCheckoutSessionCreateAPIView, 
                    StripeWebhookAPIView, 
                    CreatePaypalOrderViewRemote,
                    CheckoutPaypalOrderView,
                    )

app_name = "payment"

router = DefaultRouter()
router.register(r"", PaymentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("stripe/create-checkout-session/<int:order_id>/", StripeCheckoutSessionCreateAPIView.as_view(), name="checkout_session"),
    path("stripe/webhook/", StripeWebhookAPIView.as_view(), name="stripe_webhook"),
    path("checkout/<int:pk>/", CheckoutAPIView.as_view(), name="checkout"),
]

urlpatterns += [
    path('paypal/create/order/<int:order_id>/', CreatePaypalOrderViewRemote.as_view(), name='paypal_order_create'),
    path('paypal/checkout/order/<int:order_id>/', CheckoutPaypalOrderView.as_view(), name='checkout_paypal_order'),
]