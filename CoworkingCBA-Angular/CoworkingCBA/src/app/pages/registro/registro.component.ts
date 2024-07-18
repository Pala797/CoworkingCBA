import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  constructor(private router: Router, private authService: AuthService) {}

  registro() {
    const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
    const apellido = (document.getElementById('apellido') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    const user = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password,
    };

    console.log('Datos enviados al backend:', user);
    this.authService.register(user).subscribe(
      response => {
        alert('Usuario registrado exitosamente, ingrese sesion');
        this.router.navigate(['/login']);
      },
      error => {
        alert('Error al registrar usuario');
        console.error(error);
      }
    );

    return false; // Evita que el formulario se envíe realmente
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
