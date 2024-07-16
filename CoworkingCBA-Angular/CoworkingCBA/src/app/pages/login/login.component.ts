import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  login() {
    // Aquí se maneja la lógica de autenticación
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // Ejemplo básico de autenticación (reemplaza con tu lógica real)
    if (username === 'usuario' && password === 'contraseña') {
      alert('Login exitoso!');
      // Aquí podrías redirigir a otra página o ejecutar acciones adicionales
    } else {
      alert('Usuario o contraseña incorrectos.');
    }

    // Evita que el formulario se envíe realmente
    return false;
  }

}
