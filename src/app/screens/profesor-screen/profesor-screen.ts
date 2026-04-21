import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profesor-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profesor-screen.html',
  styleUrls: ['./profesor-screen.scss']
})
export class ProfesorScreen {

  constructor(private router: Router){}

  irPosts(){
    this.router.navigate(['/profesor/post']);
  }

  irCategorias(){
    this.router.navigate(['/profesor/categorias']);
  }

  irReportes(){
    this.router.navigate(['/profesor/reportes']);
  }
 irAlForo(): void {
  this.router.navigate(['/dashboard']);
}
 salir() {
  localStorage.removeItem('token');
  localStorage.removeItem('rol');
  this.router.navigate(['/login']);
}
irAnalytics() {
  this.router.navigate(['/analytics-page']);
}
}