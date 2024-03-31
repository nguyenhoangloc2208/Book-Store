from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from orders.models import Order, OrderItem
from orders.permissions import (IsOrderByBuyerOrAdmin,
                                IsOrderItemByBuyerOrAdmin, IsOrderItemPending,
                                IsOrderPending)
from orders.serializers import (OrderItemSerializer, OrderReadSerializer,
                                OrderWriteSerializer)
from rest_framework.response import Response
from rest_framework.exceptions import NotFound


class OrderItemViewSet(viewsets.ModelViewSet):
    """
    CRUD order items that are associated with the current order id.
    """

    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsOrderItemByBuyerOrAdmin]

    def get_queryset(self):
        res = super().get_queryset()
        order_id = self.kwargs.get("order_id")
        return res.filter(order__id=order_id)

    def perform_create(self, serializer):
        order = get_object_or_404(Order, id=self.kwargs.get("order_id"))
        serializer.save(order=order)

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes += [IsOrderItemPending]

        return super().get_permissions()


class OrderViewSet(viewsets.ModelViewSet):
    """
    CRUD orders of a user
    """

    queryset = Order.objects.all()
    permission_classes = [IsOrderByBuyerOrAdmin]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return OrderWriteSerializer

        return OrderReadSerializer

    # def get_queryset(self):
    #     res = super().get_queryset()
    #     user = self.request.user
    #     return res.filter(buyer=user)
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.queryset.filter(buyer=self.request.user)
        else:
            return Order.objects.none()

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            self.permission_classes += [IsOrderPending]

        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def pending_order(self, request):
        """
        Retrieve orders with status 'P' (pending)
        """
        pending_orders = self.queryset.filter(status='P')
        serializer = self.get_serializer(pending_orders, many=True)

        # Thay đổi trạng thái của đơn hàng nếu order_items rỗng
        for order in serializer.data:
            if not order['order_items']:
                order_instance = self.get_queryset().get(pk=order['id'])
                order_instance.status = Order.DELETE
                order_instance.save()
                
        # if not pending_orders.exists():
        #     raise NotFound("No pending orders found.")

        return Response(serializer.data)