# Generated by Django 4.2 on 2023-05-09 12:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotel',
            name='image',
            field=models.ImageField(default='https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930', upload_to=''),
        ),
    ]