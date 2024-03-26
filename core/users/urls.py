from django.urls import path, include
from .views import UserRegisterationAPIView, UserLoginApiView, UserAPIView, AddressViewSet, ProfileAPIView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"", AddressViewSet)

app_name = 'users'

urlpatterns = [
    path('register/', UserRegisterationAPIView.as_view(), name="user_register"),
    path('login/', UserLoginApiView.as_view(), name="user_login"),
    path("profile/", UserAPIView.as_view(), name="user_detail"),
    path("profile/address/", include(router.urls)),
    path('profile/update-avatar/', ProfileAPIView.as_view(), name='update_avatar'),
]