import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="login()">
      <input type="text" [(ngModel)]="username" name="username" placeholder="Username">
      <input type="password" [(ngModel)]="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
