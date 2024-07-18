// login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    this.http.post<any>('http://localhost:8000/api/login/', { email, password })
      .subscribe(
        response => {
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/catalogo']);  
        },
        error => {
          alert('Usuario o contraseña incorrectos.');
        }
      );

    return false;
  }

  navigateToRegister() {
    this.router.navigate(['/registro']);
  }
}
