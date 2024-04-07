# Generated by Django 3.2.4 on 2024-04-06 06:04

from django.db import migrations, models
import django.db.models.deletion
import products.utilities


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Content',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paragraph', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to=products.utilities.blogs_image_path)),
                ('image_number', models.IntegerField(default=0)),
                ('image_alt', models.CharField(blank=True, max_length=100)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='content', to='blogs.post')),
            ],
        ),
    ]