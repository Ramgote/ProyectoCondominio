from django.apps import AppConfig
class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modulos.usuarios'
    verbose_name = 'Gestión de Usuarios'
    def ready(self):
        import modulos.usuarios.signals
