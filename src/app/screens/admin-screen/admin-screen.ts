import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-screen.html',
  styleUrls: ['./admin-screen.scss'],
})
export class AdminScreen {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  irAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  salir(): void {
    this.authService.logout();
  }
}