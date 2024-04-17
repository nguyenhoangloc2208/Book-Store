# Generated by Django 3.2.4 on 2024-04-06 06:02

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import products.utilities


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=50, unique=True, verbose_name='Author name')),
                ('slug', models.SlugField(blank=True, max_length=100, null=True, unique=True)),
                ('number_of_books', models.SmallIntegerField(default=0, verbose_name='number_of_books')),
            ],
            options={
                'verbose_name': 'Author',
                'verbose_name_plural': 'Authors',
            },
        ),
        migrations.CreateModel(
            name='ProductCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Category name')),
                ('image', models.ImageField(blank=True, max_length=255, null=True, upload_to=products.utilities.category_image_path)),
                ('slug', models.SlugField(blank=True, max_length=100, null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Book Category',
                'verbose_name_plural': 'Book Categories',
            },
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=products.utilities.product_image_path)),
                ('name', models.CharField(default='alt', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('description', models.TextField()),
                ('price', models.FloatField(validators=[django.core.validators.MinValueValidator(0)])),
                ('discount_percentage', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('final_price', models.FloatField(default=0)),
                ('count_in_stock', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('available', models.BooleanField()),
                ('sold_count', models.IntegerField(default=0)),
                ('slug', models.SlugField(blank=True, max_length=100, null=True, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='author_book', to='products.author', verbose_name='book_author')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_list', to='products.productcategory')),
                ('image', models.ManyToManyField(blank=True, related_name='product_image', to='products.ProductImage')),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
    ]