# Generated by Django 3.2.4 on 2024-03-25 10:40

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0003_rename_profile_avatar'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Avatar',
            new_name='Profile',
        ),
    ]
