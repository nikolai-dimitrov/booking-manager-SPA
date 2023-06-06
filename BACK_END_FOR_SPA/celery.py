import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BACK_END_FOR_SPA.settings")

app = Celery("BACK_END_FOR_SPA")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
