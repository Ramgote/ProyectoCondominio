
from django.contrib import admin
from modulos.usuarios.models import *

admin.site.register(Phone)

# class PhoneAdmin(admin.ModelAdmin):
#    list_display = ('id', 'number', 'idUser')
#    search_fields = ('number', 'idUser__username')
#    list_filter = ('idUser',)