from django.db import models 
from django.core.validators import RegexValidator
# Create your models here. 

solo_numeros_validator = RegexValidator(
    r'^\d+$',  # Expresión regular que verifica solo dígitos
    'Este campo solo admite números.',  # Mensaje de error si la validación falla
    'invalid_number' # Código de error
)

class Residente(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    ci = models.CharField(max_length=8)
    nombre = models.CharField(max_length=40)
    apPaterno = models.CharField(max_length=35)
    apMaterno = models.CharField(max_length=35, blank=True)
    # tipo = models.CharField(max_length=1, choices=)
    fechaCreacion = models.DateTimeField(auto_now=True)
    fechaModificacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        txt = "{0} {1} {2}"
        return txt.format(self.nombre, self.apPaterno, self.apMaterno)
    
class Telefono(models.Model):
    id = models.AutoField(primary_key=True)
    numero = models.CharField(
        max_length=10,
        validators=[solo_numeros_validator],
        help_text="Ingrese un número (solo dígitos)."
    )
    idResidente = models.ForeignKey(Residente, null=False, blank=False, on_delete=models.CASCADE)
    
class TipoVehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=30)

    def __str__(self):
        txt = "{0}"
        return txt.format(self.tipo)

class MarcaVehiculo(models.Model):
    id = models.AutoField(primary_key=True)
    marca = models.CharField(max_length=30)

    def __str__(self):
        txt = "{0}"
        return txt.format(self.marca)
    
class Vehiculo(models.Model):
    id = models.AutoField(primary_key=True)    
    color = models.CharField(max_length=30)
    placa = models.CharField(max_length=10)
    marca = models.ForeignKey(MarcaVehiculo, null=False, blank=False, on_delete=models.CASCADE)
    idTipo = models.ForeignKey(TipoVehiculo, null=False, blank=False, on_delete=models.CASCADE)
    idResidente = models.ForeignKey(Residente, null=False, blank=False, on_delete=models.CASCADE)

    def __str__(self):
        txt = "{0}, {1}, placa : {2}"
        return txt.format(self.marca, self.color, self.placa)