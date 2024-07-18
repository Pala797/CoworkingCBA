# serializers.py

from rest_framework import serializers
from .models import Usuario

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