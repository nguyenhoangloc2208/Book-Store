from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from dj_rest_auth.registration.views import (ResendEmailVerificationView, VerifyEmailView)
from users.views import (email_confirm_redirect, password_reset_confirm_redirect)
from django.views.generic import TemplateView
from dj_rest_auth.views import (LogoutView, PasswordChangeView, PasswordResetConfirmView, PasswordResetView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('users.urls', namespace="users")),
    path('api/products/', include('products.urls', namespace="products")),
    path('api/user/orders/', include('orders.urls', namespace='orders')),
    path('api/user/payments/', include('payment.urls', namespace='payment')),
    path('api/blogs/', include('blogs.urls', namespace="blogs")),
    path('logout/', LogoutView.as_view(), name="rest_logout"),
    path(
        'resend-email/', ResendEmailVerificationView.as_view(), name='rest_resend_email'
    ),
    re_path(
        r'^account-confirm-email/(?P<key>[-:\w]+)/$',
        email_confirm_redirect,
        name='account_confirm_email',
    ),
    re_path(
        r'^account-confirm-email/',
        VerifyEmailView.as_view(),
        name='account_email_verification_sent',
    ),
    path(
        'account-email-verification-sent/',
        TemplateView.as_view(),
        name='account_email_verification_sent',
    ),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('password/reset/', PasswordResetView.as_view(),
         name='rest_password_reset'),
    path(
        'password/reset/confirm/<str:uidb64>/<str:token>',
        password_reset_confirm_redirect,
        name='password_reset_confirm',
    ),
    path(
        'password/reset/confirm/',
        PasswordResetConfirmView.as_view(),
        name='password_reset_confirm',
    ),
    path('password/change/', PasswordChangeView.as_view(),
         name='rest_password_change'),
]

schema_view = get_schema_view(
   openapi.Info(
      title="BookStore API",
      default_version='v1',
      description="APIs for Book Store",
      terms_of_service="https://www.app.com/policies/terms/",
      contact=openapi.Contact(email="nguyenhoangloc2208@gmail.com"),
      license=openapi.License(name="Nguyễn Hoàng Lộc"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#Paypal 
# urlpatterns += path('paypal/', include('paypal.standard.ipn.urls')),