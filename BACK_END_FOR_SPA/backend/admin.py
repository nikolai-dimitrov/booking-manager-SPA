from django.contrib import admin

from BACK_END_FOR_SPA.backend.models import Hotel, HotelFacilities, Room, RoomFacilities, RoomReservatedDates


# Register your models here.
@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    pass


@admin.register(HotelFacilities)
class HotelFacilitiesAdmin(admin.ModelAdmin):
    pass


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    ordering = ('hotel',)
    pass


@admin.register(RoomReservatedDates)
class RoomReservatedDatesAdmin(admin.ModelAdmin):
    pass


@admin.register(RoomFacilities)
class RoomFacilitiesAdmin(admin.ModelAdmin):
    pass
