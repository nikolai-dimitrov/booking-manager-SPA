from django.contrib.auth.models import AbstractUser
from django.db import models

from BACK_END_FOR_SPA.backend.manager import MyUserManger


# Create your models here.
class MyUser(AbstractUser):
    USERNAME_MAX_LENGTH = 50
    username = models.CharField(
        max_length=USERNAME_MAX_LENGTH,
        unique=True,
    )
    email = models.EmailField(
        unique=True,
    )
    is_staff = models.BooleanField(
        default=False,
    )
    date_joined = models.DateTimeField(
        auto_now_add=True,
    )
    is_email_verified = models.BooleanField(
        default=False)

    objects = MyUserManger()
    USERNAME_FIELD = 'username'


class Hotel(models.Model):
    FREE_ROOM_ID = ''
    name = models.CharField(
        max_length=30
    )
    country = models.CharField(
        max_length=30
    )
    city = models.CharField(
        max_length=30
    )
    stars = models.IntegerField(

    )
    rating = models.FloatField(

    )
    distance_to_center = models.FloatField(
        null=True,
        blank=True,
    )
    free_cancellation = models.BooleanField(
        default=True,
    )
    prepayment = models.BooleanField(
        default=False,
    )
    image = models.URLField(
        default='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'
    )

    def __str__(self):
        return self.name

    def set_room_id(self, r_id):
        self.FREE_ROOM_ID = r_id

    def get_room_id(self):
        return self.FREE_ROOM_ID


class Room(models.Model):
    number = models.IntegerField(
        null=True,
        blank=True,
    )
    size = models.CharField(
        default='32m2',
    )
    view = models.CharField(
        null=True,
        blank=True,
    )
    room_type = models.CharField(
        default='Single Room',
    )
    price = models.IntegerField(
        default=100,
    )

    balcony = models.BooleanField(
        default=False,
    )
    private_bath = models.BooleanField(
        default=False,
    )
    tv = models.BooleanField(
        default=False,
    )
    air_conditioning = models.BooleanField(
        default=False,
    )

    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
    )

    class Meta:
        unique_together = ('number', 'hotel')

    def __str__(self):
        return f"{self.hotel.name} - N{self.number}"

    def reservated_dates_len(self):
        return len(self.roomreservateddates_set.all())


class RoomReservatedDates(models.Model):
    check_in_data = models.DateField(
        null=True,
        blank=True,
    )
    check_out_data = models.DateField(
        null=True,
        blank=True,
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"{self.room.hotel} N{self.room.number}: {self.check_in_data} / {self.check_out_data}"


class RoomFacilities(models.Model):
    minibar = models.BooleanField(
        default=False,
    )
    coffee_machine = models.BooleanField(
        default=False,
    )
    sofa = models.BooleanField(
        default=False,
    )
    telephone = models.BooleanField(
        default=False,
    )
    safety_deposit_box = models.BooleanField(
        default=False,
    )
    heating = models.BooleanField(
        default=False,
    )
    wake_up_service = models.BooleanField(
        default=False,
    )
    socket_near_bed = models.BooleanField(
        default=False,
    )
    towels = models.BooleanField(
        default=False,
    )
    mosquito_net = models.BooleanField(
        default=False,
    )
    hairdryer = models.BooleanField(
        default=False,
    )
    wardrobe = models.BooleanField(
        default=False,
    )
    bathrobe = models.BooleanField(
        default=False,
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"{self.room.__str__()}' Facilities"


class HotelFacilities(models.Model):
    swimming_pool = models.BooleanField(
        default=False,
    )
    wifi = models.BooleanField(
        default=False,
    )
    spa_centre = models.BooleanField(
        default=False,
    )
    restaurant = models.BooleanField(
        default=False,
    )
    bar = models.BooleanField(
        default=False,
    )
    room_service = models.BooleanField(
        default=False,
    )
    laundry = models.BooleanField(
        default=False,
    )
    parking = models.BooleanField(
        default=False,
    )
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f"{self.hotel.name}'s Facilities"
class RoomReservation