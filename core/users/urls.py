from django.urls import path
from .views import UserRegisterationAPIView, UserLoginApiView

app_name = 'users'

urlpatterns = [
    path('register/', UserRegisterationAPIView.as_view(), name="user_register"),
    path('login/', UserLoginApiView.as_view(), name="user_login"),
]