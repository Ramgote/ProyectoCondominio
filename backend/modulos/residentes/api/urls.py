from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from residentes.api.views import ResidenteViewSet
from modulos.residentes.api.views import ResidenteViewSet

router = DefaultRouter()
router.register(r'residentes', ResidenteViewSet, basename='residentes')

urlpatterns = router.urls
