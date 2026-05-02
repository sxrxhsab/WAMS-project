from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EquipmentViewSet, ReservationViewSet, test_secure

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('test/', test_secure),
    path('', include(router.urls)),
]