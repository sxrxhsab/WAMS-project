from rest_framework import viewsets, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from django.utils import timezone

from .models import Equipment, Reservation
from .serializers import EquipmentSerializer, ReservationSerializer
print("📤 Envoi vers microservice RabbitMQ")
from .rabbitmq import send_reservation_message


# 🔥 TEST API
@api_view(['GET'])
@permission_classes([AllowAny])
def test_secure(request):
    return Response({
        "message": "API sécurisée OK 🔐"
    })


# 📦 EQUIPMENT
class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [permissions.IsAuthenticated]


# 📅 RESERVATION
class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        equipment = serializer.validated_data.get('equipment')
        date = serializer.validated_data.get('date')

        # 🔥 empêcher date passée
        if date < timezone.now():
            raise ValidationError("⚠️ Impossible de réserver dans le passé")

        # 🔥 empêcher double réservation
        conflict = Reservation.objects.filter(
            equipment=equipment,
            date=date,
            status__in=['pending', 'confirmed']
        ).exists()

        if conflict:
            raise ValidationError("⚠️ Équipement déjà réservé à cette date")

        # ✅ sauvegarde
        reservation = serializer.save(user=self.request.user)

        # 🔥 ENVOI RABBITMQ
        send_reservation_message({
            "id": reservation.id,
            "equipment": reservation.equipment.name,
            "date": str(reservation.date),
            "status": reservation.status
        })