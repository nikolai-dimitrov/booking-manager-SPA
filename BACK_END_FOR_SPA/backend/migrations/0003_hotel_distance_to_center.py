# Generated by Django 4.2 on 2023-05-09 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_hotel_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='distance_to_center',
            field=models.FloatField(blank=True, null=True),
        ),
    ]