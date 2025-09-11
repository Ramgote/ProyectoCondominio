from rest_framework import serializers
from ..models import Residente, TipoVehiculo, MarcaVehiculo, Vehiculo

class ResidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Residente
        fields = '__all__'
        read_only_fields = ('fechaCreacion', 'fechaModificacion')

class TipoVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoVehiculo
        fields = '__all__'

class MarcaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarcaVehiculo
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source='marca.marca', read_only=True)
    tipo_nombre = serializers.CharField(source='idTipo.tipo', read_only=True)
    residente_nombre = serializers.CharField(source='idResidente.nombre', read_only=True)
    
    class Meta:
        model = Vehiculo
        fields = '__all__'
        extra_kwargs = {
            'marca': {'write_only': True},
            'idTipo': {'write_only': True},
            'idResidente': {'write_only': True}
        }