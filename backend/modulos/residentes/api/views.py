from rest_framework import viewsets
from ..api.serializer import ResidenteSerializer
from ..models import Residente
# Create your views here.

class ResidenteViewSet(viewsets.ModelViewSet):
    queryset = Residente.objects.all()
    serializer_class = ResidenteSerializer