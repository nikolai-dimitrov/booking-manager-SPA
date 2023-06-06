from celery import shared_task
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)


@shared_task
def sample_task():
    logger.info("Deleting past bookings!")

    from datetime import datetime
    from BACK_END_FOR_SPA.backend.models import RoomReservatedDates

    # Delete past bookings
    today = datetime.today()
    all_reservations = RoomReservatedDates.objects.all()
    past_reservations = all_reservations.filter(check_in_data__lte=today)
    past_reservations.delete()
