from django.urls import path

from BACK_END_FOR_SPA.backend.views import IndexView, SignUpView, LoginView, \
    HotelListApiView, RoomListApiView, ReservationCreateView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='sign up'),
    path('login/', LoginView.as_view(), name='log in'),
    # path('logout/', Logout.as_view(), name='log out'),
    path('hotels/', HotelListApiView.as_view(), name='list hotels'),
    path('rooms/', RoomListApiView.as_view(), name='list rooms'),
    path('reservation/create/', ReservationCreateView.as_view(), name='create reservation'),
]
