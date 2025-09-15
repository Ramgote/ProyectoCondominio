from rest_framework import viewsets, permissions
from django.contrib.auth.models import User, Group
from modulos.usuarios.models import Phone
from .serializer import UserSerializer, UserCreateUpdateSerializer, PhoneSerializer, GroupSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateUpdateSerializer
        return UserSerializer


class PhoneViewSet(viewsets.ModelViewSet):
    queryset = Phone.objects.all().order_by('id')
    serializer_class = PhoneSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('id')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
