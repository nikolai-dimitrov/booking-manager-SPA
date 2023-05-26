from django.shortcuts import render
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.views.generic import TemplateView
from rest_framework import generics as rest_views, status
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.views import APIView
from django.contrib.auth import authenticate

from BACK_END_FOR_SPA.backend.mixins import CheckRoomsAvailability, check_room_availability, get_free_room
from BACK_END_FOR_SPA.backend.models import Hotel, MyUser, Room, RoomReservatedDates
from BACK_END_FOR_SPA.backend.serializers import SignUpSerializer, ShortHotelSerializer, ShortRoomSerializer, \
    HotelSerializer, RoomSerializer, ReservationsCreateSerializer


# Create your views here.
class IndexView(TemplateView):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        response = render(request, self.template_name)
        # TODO: TO UNDERSTAND SERIALIZERS DONCHO VIDEOTO PSLEDNIQ 1 CHAS
        if request.user.is_superuser:
            admin_token = Token.objects.filter(user_id=request.user.id).get()
            response.set_cookie('ADMIN-TOKEN', admin_token)
        else:
            response.set_cookie('ADMIN-TOKEN', '')
        return response


class ListItemsView(rest_views.ListAPIView):
    permission_classes = [IsAuthenticated]


class SignUpView(rest_views.GenericAPIView):
    serializer_class = SignUpSerializer
    # permission_classes = [AllowAny]
    permission_classes = []

    def post(self, request: Request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()

            response = {'message': 'User Created Successfuly.'}

            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request: Request):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(email=email, username=username, password=password)

        if user is not None:
            response = {
                'message': 'Login Successfuly',
                'token': user.auth_token.key,
            }

            return Response(data=response, status=status.HTTP_200_OK)
        else:
            return Response(data={'message': 'Invalid username or password!'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request: Request):
        content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }
        return Response(data=content, status=status.HTTP_200_OK)


class HotelListApiView(rest_views.ListCreateAPIView, CheckRoomsAvailability):
    authentication_classes = []
    permission_classes = []
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    def get_queryset(self):
        hotels = self.queryset.all()

        destination = self.request.query_params.get('destination')
        check_in_date = self.request.query_params.get('checkInDate')
        check_out_date = self.request.query_params.get('checkOutDate')
        room_type = self.request.query_params.get('roomType')

        if len(self.request.query_params) == 0:
            return hotels
        else:
            if destination is not None:
                hotels = self.queryset.filter(city=destination)
            room_type = room_type

            hotels = hotels.filter(room__room_type=room_type)
            if not hotels:
                return set(hotels)
            if check_in_date is not None and check_out_date is not None:
                hotels_with_free_rooms = set()
                for current_hotel in set(hotels):
                    rooms = current_hotel.room_set.filter(room_type=room_type)
                    rooms = sorted(rooms, key=lambda x: -(x.reservated_dates_len()))
                    available_rooms = get_free_room(rooms, Room.objects.all(), check_in_date, check_out_date)
                    if available_rooms:
                        current_hotel.set_room_id(available_rooms[0].id)
                        current_hotel.get_room_id()
                        hotels_with_free_rooms.add(current_hotel)
                return hotels_with_free_rooms
            else:
                return set(hotels)


class RoomListApiView(rest_views.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def get_queryset(self):
        rooms = self.queryset.all()
        hotel_name = self.request.query_params.get('hotelName')
        room_type = self.request.query_params.get('roomType')
        check_in_date = self.request.query_params.get('checkIn')
        check_out_date = self.request.query_params.get('checkOut')

        rooms = rooms.filter(hotel__name=hotel_name, room_type=room_type)
        if check_in_date and check_out_date:
            rooms = sorted(rooms, key=lambda x: -(x.reservated_dates_len()))
            available_rooms = get_free_room(rooms, self.queryset, check_in_date, check_out_date)
            return available_rooms
        return rooms


class ReservationCreateView(rest_views.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationsCreateSerializer

    def post(self, request: Request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            # TODO: 1 DA SMENQ ALERTITE POVECHETO S NQKAKUV VID NOTIFIKACII,!! ,, 2 da pregledam js koda da iztriq kakvoto e nujno!!!
            # TODO:V SETTINGS DA OPRAVQ ZAKOMENTIRANOTO
            # TODO: ako reservaciqta e s free cancelation da moga da q triq ot strancicata s moite reservacii!!!
            # TODO: ako e do 1 chas sled napravata da moje da se updeitne datata ot stranicata reservations!!!
            # TODO: DA NAPRAVQ USER KUM REZERVACIQ ZA DA MY GI POKAZVA V RESERVATIONS!!!
            # TODO NQKAK KATO MINE DATATA DA SE MAHA REZERVACIQTA AKO MOJE ???
            response = {'message': 'Reservated successfully.'}

            return Response(data=response, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
