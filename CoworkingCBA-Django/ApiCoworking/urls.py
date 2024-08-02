from django.urls import path

from ApiCoworking import views
from .views import *
from .views import reservar
from .views import RegistroUsuario, LoginUsuario,obtener_reservas,cancelar_reserva

urlpatterns = [
    path('registro', RegistroUsuario.as_view(), name='registro'), 
    path('login/', LoginUsuario.as_view(), name='login'),
    path('catalogo-salas/', views.catalogo_salas, name='catalogo_salas'),
    path('obtener_reservas/', views.obtener_reservas, name='obtener_reservas'),
    path('reservar/',views.reservar, name='reservar'),
    path('cancelar_reserva/<int:reserva_id>/', views.cancelar_reserva, name='cancelar_reserva'),
    
]
