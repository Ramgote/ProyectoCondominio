from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modulos.residentes.api.views import (
    ResidenteViewSet, 
    TipoVehiculoViewSet,
    MarcaVehiculoViewSet,
    VehiculoViewSet
)

router = DefaultRouter()
router.register(r'residentes', ResidenteViewSet, basename='residentes')
router.register(r'tipos-vehiculo', TipoVehiculoViewSet, basename='tipos-vehiculo')
router.register(r'marcas-vehiculo', MarcaVehiculoViewSet, basename='marcas-vehiculo')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculos')

# Ruta adicional para obtener vehículos por residente
vehiculo_por_residente = VehiculoViewSet.as_view({
    'get': 'por_residente'
})

urlpatterns = [
    path('', include(router.urls)),
    path('residentes/<int:residente_id>/vehiculos/', vehiculo_por_residente, name='vehiculos-por-residente'),
]
