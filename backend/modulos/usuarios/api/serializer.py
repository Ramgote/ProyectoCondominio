from rest_framework import serializers
from django.contrib.auth.models import User, Group
from modulos.usuarios.models import Phone


class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = ['id', 'number']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']


class UserSerializer(serializers.ModelSerializer):
    phones = PhoneSerializer(source='phone_set', many=True, read_only=True)
    groups = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=Group.objects.all()
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name',
                  'last_name', 'is_active', 'groups', 'phones']


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer separado para creación/actualización de usuarios"""
    password = serializers.CharField(write_only=True, required=False)
    groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Group.objects.all(), required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name',
                  'last_name', 'password', 'is_active', 'groups']

    def create(self, validated_data):
        groups_data = validated_data.pop('groups', [])
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        user.groups.set(groups_data)
        return user

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups', [])
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()
        if groups_data:
            instance.groups.set(groups_data)
        return instance
