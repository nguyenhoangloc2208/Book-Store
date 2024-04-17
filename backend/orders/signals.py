from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Order
        
@receiver(pre_delete, sender=Order)
def update_order_on_delete(sender, instance, **kwargs):
    instance.status = Order.CANCELLED 
    instance.save(update_fields=['status'])