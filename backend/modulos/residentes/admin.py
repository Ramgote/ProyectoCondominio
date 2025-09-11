from django.contrib import admin
from modulos.residentes.models import * 
# Register your models here.

admin.site.register(Residente)
admin.site.register(Vehiculo)
admin.site.register(TipoVehiculo)
admin.site.register(MarcaVehiculo)