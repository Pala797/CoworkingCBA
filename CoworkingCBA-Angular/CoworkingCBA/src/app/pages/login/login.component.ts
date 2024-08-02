import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  login() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    this.authService.login(email, password).subscribe(
      response => {
        alert('Inicio de sesión exitoso');
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
