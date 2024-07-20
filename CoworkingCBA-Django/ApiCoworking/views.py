# views.py

from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .models import Sala
from .serializers import UsuarioSerializer
from .serializers import LoginSerializer
import logging

def catalogo_salas(request):
    salas = Sala.objects.all()
    data = list(salas.values('id', 'nombre_sala', 'capacidad', 'precio','imagen_url'))
    return JsonResponse(data, safe=False)

# Configura el logger para esta vista
logger = logging.getLogger(__name__)

class RegistroUsuario(APIView):
    def post(self, request):
        logger.info(f"Datos recibidos en el backend: {request.data}")

        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info("Usuario registrado exitosamente")
            return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Error al registrar usuario: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LoginUsuario(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            # Aquí podrías generar un token de autenticación si estás utilizando Django REST Framework JWT u otro método
            return Response({'message': 'Inicio de sesión exitoso', 'user_id': user.id}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        