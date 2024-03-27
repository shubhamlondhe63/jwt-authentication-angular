import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <h1>Welcome to the Dashboard</h1>
    <button (click)="logout()">Logout</button>
  `
})
export class DashboardComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
