from django.db import models

from django.db import models

class Propiedad(models.Model):
    id = models.AutoField(primary_key=True)    
    numero_unidad = models.CharField(
        max_length=10, 
        unique=True, 
        verbose_name="Número de Unidad",
        help_text="Número o identificador único de la propiedad (ej. A-101, Torre B-205)."
    )
    direccion = models.CharField(
        max_length=100,
        help_text="Indique una dirección (ej. Calle Yotaú # 12)."
        )
    descripcion = models.TextField(
        blank=True, 
        null=True,
        help_text="Una descripción detallada de la propiedad."
    ) 
    tipo = [('V', 'Vivienda'), ('C', 'Comercial')]
    tipo_propiedad = models.CharField(max_length=1, choices=tipo, default='V')
    habitada = models.BooleanField(default=False, help_text="Tickear si la propiedad está habitada")
    class Meta:
        verbose_name = "Propiedad"
        verbose_name_plural = "Propiedades"
        ordering = ["numero_unidad"]

    def __str__(self):
        return f"Propiedad {self.numero_unidad}"
