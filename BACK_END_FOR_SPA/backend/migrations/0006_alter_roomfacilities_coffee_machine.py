# Generated by Django 4.2 on 2023-05-12 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0005_hotel_free_cancellation_hotel_prepayment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roomfacilities',
            name='coffee_machine',
            field=models.BooleanField(default=False, verbose_name='Coffee Machine'),
        ),
    ]
