# Generated by Django 4.2 on 2023-05-10 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_alter_hotel_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='free_cancellation',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='hotel',
            name='prepayment',
            field=models.BooleanField(default=False),
        ),
    ]