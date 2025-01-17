# serializers.py

from rest_framework import serializers
from .models import Usuario
from .models import Reserva

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ('nombre', 'apellido', 'email', 'password')
    
    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = Usuario.objects.filter(email=email).first()
            if user and user.check_password(password):
                return user
            else:
                raise serializers.ValidationError("Credenciales incorrectas. Intente de nuevo.")
        else:
            raise serializers.ValidationError("Debe proporcionar un correo electrónico y contraseña.")
    


class ReservaSerializer(serializers.ModelSerializer):
    usuario_id = serializers.IntegerField()  
    sala_id = serializers.IntegerField()  
    id = serializers.IntegerField()

    class Meta:
        model = Reserva
        fields = ['id','usuario_id', 'sala_id', 'dia_reservado', 'precio']

    def validate(self, data):
        sala_id = data.get('id')
        dia_reservado = data.get('dia_reservado')


        if Reserva.objects.filter(sala_id=sala_id, dia_reservado=dia_reservado).exists():
            raise serializers.ValidationError("Esta sala no esta disponible para la fecha seleccionada.")
        
        return data

    def create(self, validated_data):
        id = validated_data.pop('id')
        usuario_id = validated_data.pop('usuario_id')
        sala_id = validated_data.pop('sala_id')
        dia_reservado = validated_data.pop('dia_reservado')
        precio = validated_data.pop('precio')

        reserva = Reserva.objects.create(
            id=id,
            usuario_id=usuario_id,
            sala_id=sala_id,
            dia_reservado=dia_reservado,
            precio=precio
        )
        return reserva
