from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modulos.propiedades.api.views import PropiedadViewSet

router = DefaultRouter()
router.register(r'propiedades', PropiedadViewSet, basename='propiedades')

urlpatterns = [
    path('', include(router.urls)),
]