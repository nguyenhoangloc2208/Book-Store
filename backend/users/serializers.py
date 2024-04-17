from rest_framework import serializers, status
from django.contrib.auth import get_user_model, authenticate
from dj_rest_auth.registration.serializers import RegisterSerializer
from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework.validators import UniqueValidator
from django.utils.translation import gettext as _
from .exceptions import (AccountDisabledException, AccountNotRegisteredException, InvalidCredentialsException)
from .models import PhoneNumber, Address, Profile
from django_countries.serializers import CountryFieldMixin
from rest_framework.response import Response

User = get_user_model()

class UserRegistrationSerializer(RegisterSerializer):
    """
    Serializer for registrating new users using email or phone number.
    """

    username = None
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    phone_number = PhoneNumberField(
        required=False,
        write_only=True,
        validators=[
            UniqueValidator(
                queryset=PhoneNumber.objects.all(),
                message=_(
                    "A user is already registered with this phone number."),
            )
        ],
    )
    email = serializers.EmailField(required=False)

    def validate(self, validated_data):
        email = validated_data.get("email", None)
        phone_number = validated_data.get("phone_number", None)
        if email:
            username = email.split('@')[0]
            if User.objects.filter(username=username).exists():
                User.objects.filter(username=username).delete()

        if not (email or phone_number):
            raise serializers.ValidationError(
                _("Enter an email or a phone number."))

        if validated_data["password1"] != validated_data["password2"]:
            raise serializers.ValidationError(
                _("The two password fields didn't match.")
            )

        return validated_data

    def get_cleaned_data_extra(self):
        return {
            "phone_number": self.validated_data.get("phone_number", ""),
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
        }

    def create_extra(self, user, validated_data):
        user.first_name = self.validated_data.get("first_name")
        user.last_name = self.validated_data.get("last_name")
        user.save()

        phone_number = validated_data.get("phone_number")

        if phone_number:
            PhoneNumber.objects.create(user=user, phone_number=phone_number)

    def custom_signup(self, request, user):
        self.create_extra(user, self.get_cleaned_data_extra())
    
class PhoneNumberSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize phone number.
    """
    class Meta:
        model = PhoneNumber
        fields = ("phone_number",)

class UserLoginSerializer(serializers.Serializer):
    """
    Serializer to login user with email
    """
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(write_only=True, style={"input_type":"password"})
    
    def _validate_email(self, email, password):
        user = None
        
        if email and password:
            user = authenticate(username=email, password=password)
            if user is None:
                raise InvalidCredentialsException()
        else:
            raise serializers.ValidationError(
                _("Enter an email and password!")
            )    
        return user

    def validate(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")
        
        user = None
        
        user = self._validate_email(email, password)
        
        if not user:
            raise InvalidCredentialsException()
        if not user.is_active:
            raise AccountDisabledException()
        else:
            email_address = user.emailaddress_set.filter(email = user.email, verified=True).exists()
            if not email_address:
                raise serializers.ValidationError(_("Email is not verified!"))
            
        validated_data["user"] = user
        return validated_data


class AddressSerializer(CountryFieldMixin, serializers.ModelSerializer):
    """
    Serializer class to seralize Address model
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Address
        fields = "__all__"
    

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer class to serialize the user Profile model
    """

    class Meta:
        model = Profile
        fields = (
            "avatar",
            "created_at",
            "updated_at",
        )

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer class to seralize User model
    """

    profile = ProfileSerializer(read_only=True)
    phone_number = PhoneNumberField(source="phone", read_only=True)
    addresses = AddressSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "is_active",
            "profile",
            "addresses",
        )



class ShippingAddressSerializer(CountryFieldMixin, serializers.ModelSerializer):
    """
    Serializer class to seralize address of type shipping

    For shipping address, automatically set address type to shipping
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("address_type",)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["address_type"] = "S"

        return representation


class BillingAddressSerializer(CountryFieldMixin, serializers.ModelSerializer):
    """
    Serializer class to seralize address of type billing

    For billing address, automatically set address type to billing
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ("address_type",)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["address_type"] = "B"

        return representation