from django.urls import path, include
from rest_framework.routers import DefaultRouter
from modulos.usuarios.api.views import ( 
    UserViewSet, 
    PhoneViewSet, 
    GroupViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UserViewSet, basename='usuarios')
router.register(r'phones', PhoneViewSet, basename='phones')
router.register(r'groups', GroupViewSet, basename='groups')

urlpatterns = [
    path('', include(router.urls)),
]
