# Generated by Django 3.2.4 on 2024-03-08 20:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_productimage_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='productimage',
            name='name',
            field=models.CharField(default='alt', max_length=255),
        ),
    ]
