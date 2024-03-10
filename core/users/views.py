from django.contrib.auth import get_user_model
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from .serializers import UserRegistrationSerializer, PhoneNumberSerializer, UserLoginSerializer
from django.utils.translation import gettext as _
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import (GenericAPIView)
from django.http import HttpResponseRedirect
from django.conf import settings

User = get_user_model()

class UserRegisterationAPIView(RegisterView):
    """
    Register new users using phone number or email and password.
    """

    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        response_data = ""

        email = request.data.get("email", None)
        phone_number = request.data.get("phone_number", None)

        if email and phone_number:
            res = SendOrResendSMSAPIView.as_view()(request._request, *args, **kwargs)

            if res.status_code == 200:
                response_data = {"detail": _(
                    "Verification e-mail and SMS sent.")}

        elif email and not phone_number:
            response_data = {"detail": _("Verification e-mail sent.")}

        else:
            res = SendOrResendSMSAPIView.as_view()(request._request, *args, **kwargs)

            if res.status_code == 200:
                response_data = {"detail": _("Verification SMS sent.")}

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
class UserLoginApiView(LoginView):
    """
    Authenticate existing users using phone number or email and password.
    """
    serializer_class = UserLoginSerializer
    
class SendOrResendSMSAPIView(GenericAPIView):
    """
    Check if submitted phone number is a valid phone number and send OTP.
    """

    serializer_class = PhoneNumberSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def email_confirm_redirect(request, key):
    return HttpResponseRedirect(
        f"{settings.EMAIL_CONFIRM_REDIRECT_BASE_URL}{key}/"
    )


def password_reset_confirm_redirect(request, uidb64, token):
    return HttpResponseRedirect(
        f"{settings.PASSWORD_RESET_CONFIRM_REDIRECT_BASE_URL}{uidb64}/{token}/"
    )