import datetime


class CheckRoomsAvailability:
    def is_room_available(self, check_in_date, check_out_date, rooms):
        pass


# def check_room_availability(user_check_in, user_check_out, reservation_check_in, reservation_check_out):
def check_room_availability(**kwargs):
    dates_mapper = {
        'check_in_date': '',
        'check_out_date': '',
        'reservation_check_in': '',
        'reservation_check_out': '',

    }
    x = kwargs
    for key, value in kwargs.items():
        d1, m1, y1 = [int(x) for x in value.split('-')]
        dates_mapper[key] = datetime.datetime(d1, m1, y1)
    if dates_mapper['reservation_check_in'] <= dates_mapper['check_in_date'] <= dates_mapper['reservation_check_out'] or \
            dates_mapper['reservation_check_in'] <= dates_mapper['check_out_date'] <= dates_mapper[
        'reservation_check_out']:
        return False
    else:
        return True


def get_free_room(rooms, queryset, check_in_date, check_out_date):
    for room in rooms:
        reservations_checked = []
        for reservation in room.roomreservateddates_set.all():
            reservation_check_in = reservation.check_in_data
            reservation_check_out = reservation.check_out_data
            result = check_room_availability(check_in_date=f'{check_in_date}',
                                             check_out_date=f'{check_out_date}',
                                             reservation_check_in=f'{reservation_check_in}',
                                             reservation_check_out=f'{reservation_check_out}')
            reservations_checked.append(result)
        if all(reservations_checked):
            rooms = queryset.filter(id=room.id)
            return rooms
    return []
