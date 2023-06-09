# Generated by Django 4.2 on 2023-05-16 11:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_alter_room_hotel'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='check_in_data',
        ),
        migrations.RemoveField(
            model_name='room',
            name='check_out_data',
        ),
        migrations.AlterField(
            model_name='room',
            name='hotel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.hotel'),
        ),
    ]
