import { Component ,OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit  {

  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getLoggedInStatus().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }


  logout() {
    this.authService.logout();

    
  
  }
 
  
}