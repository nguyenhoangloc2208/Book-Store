from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from .utilities import *
from os.path import basename, splitext

from django.db.models.signals import pre_delete, post_save, pre_save
from django.dispatch import receiver

class ProductCategory(models.Model):
    name = models.CharField(_("Category name"), max_length=100, unique=True)
    image = models.ImageField(upload_to=category_image_path, blank=True, max_length=255, null=True)
    slug = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        self.slug = custom_slugify(self.name)
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _("Book Category")
        verbose_name_plural = _("Book Categories")
        
    def __str__(self):
        return self.name

def get_default_product_category():
    return ProductCategory.objects.get_or_create(name="Others")[0]

class Author(models.Model):
    name = models.CharField(_("Author name"), max_length=50, db_index=True, unique=True)
    slug = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    number_of_books = models.SmallIntegerField(_('number_of_books'), default=0)
    
    def save(self, *args, **kwargs):
        self.slug = custom_slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _('Author')
        verbose_name_plural = _('Authors')

class Product(models.Model):
    # specific_products = (('bk','Book'),('cr','Creation'),('st','Stationery'))
    category = models.ForeignKey(ProductCategory, related_name="product_list", on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, verbose_name=_('book_author'), related_name='author_book', null=True, blank=True)
    name = models.CharField(max_length=255, blank=False, unique=True, db_index=True)
    description = models.TextField(blank=False)
    price = models.FloatField(validators=[MinValueValidator(0)], )
    discount_percentage = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)], blank=True, null=True)
    final_price = models.FloatField(default=0)
    count_in_stock = models.IntegerField(validators=[MinValueValidator(0)])
    image = models.ManyToManyField('ProductImage', blank=True, related_name='product_image')
    available = models.BooleanField()
    slug = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        self.slug = custom_slugify(self.name)
        if self.discount_percentage is not None:
            self.final_price = self.price * (1 - (self.discount_percentage / 100))
        else:
            self.final_price = self.price
        super().save(*args, **kwargs)
        
    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return self.name
    
class ProductImage(models.Model):
    image = models.ImageField(upload_to=product_image_path)
    name = models.CharField(max_length=255, unique=False, default='alt')
    # product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Set name to the base name of the uploaded image file
        base_name = basename(self.image.name)
        name_without_extension = splitext(base_name)[0]
        self.name = name_without_extension
        super(ProductImage, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
    
def change_count_in_stock(sender, instance, **kwargs):
    instance.product.count_in_stock = instance.product.count_in_stock - instance.count
    instance.product.save()
    
    count_in_stock = instance.product.count_in_stock
    #delete from cart or reduce count
    pass

@receiver(post_save, sender=Product)
def update_author_books_count(sender, instance, created, **kwargs):
    if created:
        author = instance.author
        author.number_of_books += 1
        author.save()

@receiver(pre_delete, sender=Product)
def decrease_author_books_count(sender, instance, **kwargs):
    author = instance.author
    author.number_of_books -= 1
    author.save()

@receiver(pre_save, sender=Product)
def update_product_availability(sender, instance, **kwargs):
    if instance.count_in_stock == 0 or instance.count_in_stock is None:
        instance.available = False
    else:
        instance.available = True