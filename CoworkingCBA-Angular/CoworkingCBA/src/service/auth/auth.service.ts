import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private router: Router) {}


  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro`, user);
  }

  
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login/`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('usuarioId', response.user_id.toString());
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('accessToken', response.access); 
        this.loggedIn.next(true);
        this.router.navigate(['/catalogo']);  
      })
    );
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('accessToken');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
