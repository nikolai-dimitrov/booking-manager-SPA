# from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError

from BACK_END_FOR_SPA.backend.models import Hotel, MyUser, Room, RoomFacilities, RoomReservatedDates


# from .models import User

class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=80)
    username = serializers.CharField(max_length=45)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = MyUser
        fields = ['email', 'username', 'password']

    def validate(self, attrs):
        email_exists = MyUser.objects.filter(email=attrs['email']).exists()
        username_exists = MyUser.objects.filter(username=attrs['username']).exists()
        if email_exists:
            raise ValidationError('Email already been used!')
        if username_exists:
            raise ValidationError('Username already been used!')
        return super().validate(attrs)

    def create(self, validated_data):
        password = validated_data.pop('password')

        user = super().create(validated_data)

        user.set_password(password)

        user.save()

        Token.objects.create(user=user)

        return user


class ReservationsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomReservatedDates
        fields = ['check_in_data', 'check_out_data', 'room']

    def validate(self, attrs):
        check_in = attrs['check_in_data']
        check_out = attrs['check_out_data']
        room = attrs['room']
        reservations = room.roomreservateddates_set.all().filter(check_in_data=check_in,check_out_data=check_out)
        if reservations:
            raise ValidationError('Already have reservation in this room!')
        else:
            return super().validate(attrs)



class ShortRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class ShortHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    room_set = ShortRoomSerializer(many=True)
    free_room_id = serializers.ReadOnlyField(source='get_room_id')

    class Meta:
        model = Hotel
        fields = '__all__'


class ShortRoomFacilitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomFacilities
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    roomfacilities_set = ShortRoomFacilitiesSerializer(many=True)

    class Meta:
        model = Room
        fields = '__all__'
