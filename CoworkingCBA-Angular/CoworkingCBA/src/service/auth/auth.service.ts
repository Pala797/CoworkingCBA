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




  
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/registro`, user);
    
  }

  constructor(private http: HttpClient, private router: Router) {}
  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);  
    this.loggedIn.next(false);

  
  }
  

  login2() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/catalogo']);  
    this.loggedIn.next(true);

  
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getLoggedInStatus(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
