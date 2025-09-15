from rest_framework import serializers
from modulos.bitacora.models import Bitacora

class BitacoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bitacora
        fields = '__all__'
        # read_only_fields = ('hora_fecha')
