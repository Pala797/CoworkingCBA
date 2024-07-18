from django.urls import path

from ApiCoworking import views
from .views import *
from .views import LoginUsuario

urlpatterns = [
    path('registro', RegistroUsuario.as_view(), name='registro'),  # Ajusta la URL según tus necesidades
    path('login/', LoginUsuario.as_view(), name='login'),
]
