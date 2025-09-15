from rest_framework import serializers
from modulos.propiedades.models import Propiedad
from modulos.residentes.models import Residente

class PropiedadSerializer(serializers.ModelSerializer):
    # Campo personalizado para el número de residentes.
    # El nombre del método debe ser get_ seguido del nombre del campo.
    numero_residentes = serializers.SerializerMethodField()

    class Meta:
        model = Propiedad
        fields = '__all__' # O puedes listar los campos que necesites: ['id', 'numero_unidad', 'numero_residentes', ...]

    def get_numero_residentes(self, obj):
        # Filtra los residentes por la propiedad (idPropiedad) y por su estado.
        return Residente.objects.filter(idPropiedad=obj.id, estado='A').count()