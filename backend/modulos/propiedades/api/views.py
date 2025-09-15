from rest_framework import viewsets, filters
from modulos.propiedades.models import Propiedad
from django.contrib.auth.models import AnonymousUser # Importa AnonymousUser para comparar
from modulos.propiedades.api.serializer import (
    PropiedadSerializer
)
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class PropiedadViewSet(viewsets.ModelViewSet):
    queryset = Propiedad.objects.all().order_by('-numero_unidad')
    serializer_class = PropiedadSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['numero_unidad', 'direccion', 'tipoPropiedad', 'habitada']
    ordering_fields = ['numero_unidad', 'direccion']

    # *** AQUÍ PUEDES PONER UN PRINT PARA VERIFICAR EL USUARIO EN CADA MÉTODO ***
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            print(f"DEBUG VIEWSET (CREATE): Usuario autenticado: {self.request.user.username}")
        elif isinstance(self.request.user, AnonymousUser):
            print("DEBUG VIEWSET (CREATE): Usuario es AnonymousUser")
        else:
            print("DEBUG VIEWSET (CREATE): No se encontró usuario")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.is_authenticated:
            print(f"DEBUG VIEWSET (UPDATE): Usuario autenticado: {self.request.user.username}")
        elif isinstance(self.request.user, AnonymousUser):
            print("DEBUG VIEWSET (UPDATE): Usuario es AnonymousUser")
        else:
            print("DEBUG VIEWSET (UPDATE): No se encontró usuario")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.is_authenticated:
            print(f"DEBUG VIEWSET (DELETE): Usuario autenticado: {self.request.user.username}")
        elif isinstance(self.request.user, AnonymousUser):
            print("DEBUG VIEWSET (DELETE): Usuario es AnonymousUser")
        else:
            print("DEBUG VIEWSET (DELETE): No se encontró usuario")
        instance.delete()

    # Si necesitas verificarlo en una petición GET (listado o detalle)
    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            print(f"DEBUG VIEWSET (LIST): Usuario autenticado: {request.user.username}")
        elif isinstance(request.user, AnonymousUser):
            print("DEBUG VIEWSET (LIST): Usuario es AnonymousUser")
        else:
            print("DEBUG VIEWSET (LIST): No se encontró usuario")
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            print(f"DEBUG VIEWSET (RETRIEVE): Usuario autenticado: {request.user.username}")
        elif isinstance(request.user, AnonymousUser):
            print("DEBUG VIEWSET (RETRIEVE): Usuario es AnonymousUser")
        else:
            print("DEBUG VIEWSET (RETRIEVE): No se encontró usuario")
        return super().retrieve(request, *args, **kwargs)
    # *****************************************************************
