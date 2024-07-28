# views.py
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario
from .models import Sala
from .models import Reserva
from .serializers import ReservaSerializer
from .serializers import UsuarioSerializer
from .serializers import LoginSerializer
import logging
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken

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
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Inicio de sesión exitoso',
                'user_id': user.id,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def reservar(request):
    data = request.data.copy()
    # No se necesita validar el token de usuario
    # data['usuario_id'] = request.user.id  # Eliminado

    serializer = ReservaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])

def obtener_reservas(request):
    usuario_id = request.query_params.get('usuario_id')
    if not usuario_id:
        return Response({"error": "usuario_id es requerido"}, status=400)

    reservas = Reserva.objects.filter(usuario_id=usuario_id)
    serializer = ReservaSerializer(reservas, many=True)
    return Response(serializer.data)