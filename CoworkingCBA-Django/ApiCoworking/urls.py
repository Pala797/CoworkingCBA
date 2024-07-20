from django.urls import path

from ApiCoworking import views
from .views import *
from .views import LoginUsuario

urlpatterns = [
    path('registro', RegistroUsuario.as_view(), name='registro'), 
    path('login/', LoginUsuario.as_view(), name='login'),
     path('catalogo-salas/', views.catalogo_salas, name='catalogo_salas'),
]
