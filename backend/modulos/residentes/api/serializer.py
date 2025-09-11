from rest_framework import serializers
from ..models import Residente

class ResidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residente
        fields = '__all__' 