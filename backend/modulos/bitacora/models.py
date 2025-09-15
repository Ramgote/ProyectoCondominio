from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

User = get_user_model()

class Bitacora(models.Model) :
    id = models.AutoField(primary_key=True)
    hora_fecha = models.DateTimeField(auto_now_add=True)
    id_accion = models.IntegerField(null=True, blank=True)
    accion_realizada = models.CharField(max_length=255)
    ip_origen = models.GenericIPAddressField(null=True, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='bitacoras')

    def __str__(self):
        txt = "{0} - {1} - ID : {2} - {3}"
        # return f"{self.usuario} - {self.accion_realizada} - ID : {self.id_accion} - {self.hora_fecha_ingreso}"
        return txt.format(self.usuario, self.accion_realizada, self.id_accion, self.hora_fecha)