from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from modulos.bitacora.models import Bitacora
from .middleware import get_current_user, get_current_ip

from django.contrib.auth.models import AnonymousUser # Importa AnonymousUser para comparar

@receiver(post_save)
def registrar_accion_guardar(sender, instance, created, **kwargs):
    if sender.__name__ == 'Bitacora':  # evitar bucle infinito
        return
    
    user = get_current_user()
    ip = get_current_ip()
    # *** AQUÍ PUEDES PONER UN PRINT PARA VERIFICAR EL USUARIO ***
    if user and user.is_authenticated:
        print(f"DEBUG SIGNAL (POST_SAVE): Usuario autenticado: {user.username}")
    elif user and isinstance(user, AnonymousUser):
        print("DEBUG SIGNAL (POST_SAVE): Usuario es AnonymousUser")
    else:
        print("DEBUG SIGNAL (POST_SAVE): No se encontró usuario (o es None)")
    # ************************************************************
    accion = "Creó" if created else "Modificó"
    accion_texto = f"{accion} {sender.__name__} con ID {instance.id}"
    
    Bitacora.objects.create(        
        accion_realizada=accion_texto,
        hora_fecha=timezone.now(),
        id_accion=instance.id,
        ip_origen=ip,
        usuario=user
    )

@receiver(post_delete)
def registrar_accion_eliminar(sender, instance, **kwargs):
    if sender.__name__ == 'Bitacora':
        return
    
    user = get_current_user()
    # *** AQUÍ PUEDES PONER UN PRINT PARA VERIFICAR EL USUARIO ***
    if user and user.is_authenticated:
        print(f"DEBUG SIGNAL (POST_SAVE): Usuario autenticado: {user.username}")
    elif user and isinstance(user, AnonymousUser):
        print("DEBUG SIGNAL (POST_SAVE): Usuario es AnonymousUser")
    else:
        print("DEBUG SIGNAL (POST_SAVE): No se encontró usuario (o es None)")
    # ************************************************************
    ip = get_current_ip()
    
    accion_texto = f"Eliminó {sender.__name__} con ID {instance.id}"
    
    Bitacora.objects.create(        
        accion_realizada=accion_texto,
        hora_fecha=timezone.now(),
        id_accion=instance.id,
        ip_origen=ip,
        usuario=user
    )
