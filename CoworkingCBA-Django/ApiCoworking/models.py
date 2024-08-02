from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, apellido, password=None):
        if not email:
            raise ValueError('El usuario debe tener un correo electrónico')
   
        user = self.model(
            email=self.normalize_email(email),
            nombre=nombre,
            apellido=apellido,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class Usuario(AbstractBaseUser):
    
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  
    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    def __str__(self):
        return f'{self.nombre} {self.apellido}'

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return False 


class Sala(models.Model):
    nombre_sala = models.CharField(max_length=50)
    capacidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen_url= models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_sala

class Reserva(models.Model):
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    sala = models.ForeignKey('Sala', on_delete=models.CASCADE)
    dia_reservado = models.DateField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.precio = self.sala.precio
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Reserva de {self.usuario} en {self.sala} para {self.dia_reservado}'
