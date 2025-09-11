from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Residente, TipoVehiculo, MarcaVehiculo, Vehiculo
from .serializer import (
    ResidenteSerializer, 
    TipoVehiculoSerializer, 
    MarcaVehiculoSerializer, 
    VehiculoSerializer
)
from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ResidenteViewSet(viewsets.ModelViewSet):
    queryset = Residente.objects.all().order_by('-fechaCreacion')
    serializer_class = ResidenteSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ci', 'nombre', 'apPaterno', 'apMaterno']
    ordering_fields = ['fechaCreacion', 'apPaterno', 'nombre']

class TipoVehiculoViewSet(viewsets.ModelViewSet):
    queryset = TipoVehiculo.objects.all().order_by('tipo')
    serializer_class = TipoVehiculoSerializer
    pagination_class = None  # No necesitamos paginación para tipos de vehículo

class MarcaVehiculoViewSet(viewsets.ModelViewSet):
    queryset = MarcaVehiculo.objects.all().order_by('marca')
    serializer_class = MarcaVehiculoSerializer
    pagination_class = None  # No necesitamos paginación para marcas de vehículo

class VehiculoViewSet(viewsets.ModelViewSet):
    serializer_class = VehiculoSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['placa', 'color', 'marca__marca', 'idTipo__tipo', 'idResidente__nombre', 'idResidente__apPaterno']
    ordering_fields = ['marca__marca', 'placa']
    
    def get_queryset(self):
        queryset = Vehiculo.objects.select_related('marca', 'idTipo', 'idResidente').all()
        
        # Filtrar por idResidente si está presente en los parámetros de consulta
        residente_id = self.request.query_params.get('idResidente')
        if residente_id:
            queryset = queryset.filter(idResidente_id=residente_id)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def por_residente(self, request, residente_id=None):
        """
        Retorna los vehículos de un residente específico
        """
        vehiculos = self.get_queryset().filter(idResidente_id=residente_id)
        page = self.paginate_queryset(vehiculos)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(vehiculos, many=True)
        return Response(serializer.data)