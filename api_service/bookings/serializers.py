from rest_framework import serializers
from .models import Equipment, Reservation


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description']


class ReservationSerializer(serializers.ModelSerializer):
    equipment_name = serializers.CharField(source='equipment.name', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'equipment', 'equipment_name', 'date', 'status']
        read_only_fields = ['equipment', 'date']  # 🔥 IMPORTANT

    class Meta:
        model = Reservation
        fields = ['id', 'equipment', 'equipment_name', 'date', 'status']