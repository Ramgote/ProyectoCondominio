from rest_framework import viewsets, filters
from modulos.bitacora.models import Bitacora
from modulos.bitacora.api.serializer import (
    BitacoraSerializer
)
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class BitacoraViewSet(viewsets.ModelViewSet):
    queryset = Bitacora.objects.all().order_by('-hora_fecha')
    serializer_class = BitacoraSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['usuario', 'hora_fecha', 'accion_realizada', 'ip_origen']
    ordering_fields = ['hora_fecha', 'accion_realizada', 'usuario']
