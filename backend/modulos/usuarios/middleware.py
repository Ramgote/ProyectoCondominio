import threading
from django.contrib.auth.models import AnonymousUser # Importa AnonymousUser para comparar

_user_data = threading.local()

class RequestMiddleware:
    """Middleware para guardar el usuario y la IP del request en una variable local de thread."""
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user_data.user = getattr(request, "user", None)
        _user_data.ip = self.get_client_ip(request)
        # *** AQUÍ PUEDES PONER UN PRINT PARA VERIFICAR EL USUARIO ***
        if _user_data.user and _user_data.user.is_authenticated:
            print(f"DEBUG MIDDLEWARE: Usuario autenticado en RequestMiddleware: {_user_data.user.username}")
        elif _user_data.user and isinstance(_user_data.user, AnonymousUser):
            print("DEBUG MIDDLEWARE: Usuario es AnonymousUser en RequestMiddleware")
        else:
            print("DEBUG MIDDLEWARE: No se encontró usuario en RequestMiddleware (o es None)")
        # ************************************************************
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')

def get_current_user():
    return getattr(_user_data, 'user', None)

def get_current_ip():
    return getattr(_user_data, 'ip', None)
