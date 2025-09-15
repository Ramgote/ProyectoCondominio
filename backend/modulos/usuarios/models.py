from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import User
    
solo_numeros_validator = RegexValidator(
    r'^\d+$',  # Expresión regular que verifica solo dígitos
    'Este campo solo admite números.',  # Mensaje de error si la validación falla
    'invalid_number' # Código de error
)
    
class Phone(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.CharField(
        max_length=10,
        validators=[solo_numeros_validator],
        help_text="Ingrese un número (solo dígitos).", blank=True, null=True
    )
    idUser = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    # class Meta:
    #    app_label = 'modulos_usuarios'

    def __str__(self):
        return self.number
