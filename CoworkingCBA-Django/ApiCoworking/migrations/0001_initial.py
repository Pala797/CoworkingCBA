# Generated by Django 5.0.7 on 2024-07-17 02:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Sala',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_sala', models.CharField(max_length=50)),
                ('capacidad', models.PositiveIntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30)),
                ('apellido', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=128)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Reserva',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dia_reservado', models.DateField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('sala', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ApiCoworking.sala')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ApiCoworking.usuario')),
            ],
        ),
    ]